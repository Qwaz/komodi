import * as _ from "lodash";
import {Block, BlockBase, Command, Definition, Expression} from "./index";
import {Coordinate} from "../common/definition";
import {getMousePoint} from "../common/utils";
import {Komodi} from "../global";
import {ExpressionToken} from "./definition_parser";

export interface ArgumentAttach {
    attachType: "argument";

    target: Block;
    argumentName: string;
}

export interface ScopeAttach {
    attachType: "scope";

    target: Block;
    scopeName: string;
    scopeIndex: number;
}

export type AttachInfo = ArgumentAttach | ScopeAttach;

interface AttachSet {
    argumentAttach: Map <string, ArgumentAttach & Coordinate>;
    scopeAttach: Map <string, (ScopeAttach & Coordinate)[]>;
}

const INDICATOR_COLOR = 0x505050;
const INDICATOR_RADIUS = 3;
const NEAR = 120;

export class Attacher {
    initialDrag: boolean = false;
    dragging: Block | null = null;
    mouseOffset: Coordinate = { x: 0, y: 0 };

    private indicator = new PIXI.Graphics();

    private map: Map <Block, AttachSet> = new Map();

    init() {
        Komodi.stage.addChild(this.indicator);

        Komodi.container.on('mousemove', () => {
            this.updateDragging();
        });

        Komodi.fixed.on('mouseover', () => {
            if (!this.initialDrag) {
                this.stopDragging();
            }
        });

        Komodi.container.on('mouseup', () => {
            this.stopDragging();
        });
    }

    registerBlock(block: Block) {
        this.map.set(block, {
            argumentAttach: new Map(),
            scopeAttach: new Map(),
        });
    }

    removeBlock(block: Block) {
        this.map.delete(block);
    }

    setArgumentCoordinate(block: BlockBase, argumentName: string, coord: Coordinate) {
        if (!(block instanceof Block)) return;

        let argumentAttach = this.map.get(block)!.argumentAttach;
        if (argumentAttach.has(argumentName)) {
            let targetCoord = argumentAttach.get(argumentName)!;
            targetCoord.x = coord.x;
            targetCoord.y = coord.y;
        } else {
            argumentAttach.set(argumentName, {
                attachType: "argument",
                target: block,
                argumentName: argumentName,
                x: coord.x,
                y: coord.y
            });
        }
    }

    removeArgumentCoordinate(block: BlockBase, argumentName: string) {
        if (!(block instanceof Block)) return;

        let argumentAttach = this.map.get(block)!.argumentAttach;
        if (argumentAttach.has(argumentName)) {
            this.map.get(block)!.argumentAttach.delete(argumentName);
        }
    }

    setScopeCoordinate(block: BlockBase, scopeName: string, coordinates: Coordinate[]) {
        if (!(block instanceof Block)) return;

        let scopeAttach = this.map.get(block)!.scopeAttach;
        if (!scopeAttach.has(scopeName)) {
            scopeAttach.set(scopeName, []);
        }

        let scopeAttachArray = scopeAttach.get(scopeName)!;
        let finishIndex = Math.min(scopeAttachArray.length, coordinates.length);

        if (scopeAttachArray.length < coordinates.length) {
            for (let i = scopeAttachArray.length; i < coordinates.length; i++) {
                scopeAttachArray.push({
                    attachType: "scope",
                    target: block,
                    scopeName: scopeName,
                    scopeIndex: i,
                    x: coordinates[i].x,
                    y: coordinates[i].y
                });
            }
        }
        for (let i = 0; i < finishIndex; i++) {
            scopeAttachArray[i].x = coordinates[i].x;
            scopeAttachArray[i].y = coordinates[i].y;
        }
        scopeAttachArray.length = coordinates.length;
    }

    getNearestAttachPoint(
        stageX: number, stageY: number
    ): AttachInfo & Coordinate | null {
        if (this.dragging instanceof Definition) {
            return null;
        }

        let distance = Infinity;
        let attachPoint: AttachInfo | null = null;

        const updateDistance = (info: AttachInfo & Coordinate) => {
            let globalPosition = info.target.graphic.toGlobal(new PIXI.Point(info.x, info.y));
            let candidateDistance = Math.abs(globalPosition.x - stageX) + Math.abs(globalPosition.y - stageY);

            let now = info.target;
            while (now) {
                if (now == this.dragging) return;
                if (now.attachInfo) now = now.attachInfo.target;
                else break;
            }

            if (candidateDistance < NEAR && candidateDistance < distance && info.target != this.dragging) {
                distance = candidateDistance;
                attachPoint = info;
            }
        };

        if (Komodi.module.editingModule) {
            let blocks = Komodi.module.blockListOf(Komodi.module.editingModule);
            for (let block of blocks) {
                let attach = this.map.get(block)!;
                if (this.dragging instanceof Expression) {
                    for (let [argumentName, info] of attach.argumentAttach) {
                        let token = <ExpressionToken>block.definition.tokens.find((token) =>
                            token.kind == "expression" && token.identifier == argumentName)!;

                        if (token.type == this.dragging.definition.returnType) {
                            updateDistance(info);
                        }
                    }
                }
                if (this.dragging instanceof Command) {
                    for (let [_scopeName, infoArr] of attach.scopeAttach) {
                        for (let info of infoArr) {
                            updateDistance(info);
                        }
                    }
                }
            }
        }

        return _.clone(attachPoint);
    }

    setDragging(block: Block, initialDrag: boolean = false) {
        if (this.dragging != null) {
            return;
        }

        if (block.graphic.parent == Komodi.fixed) {
            Komodi.stage.setChildIndex(this.indicator, Komodi.stage.children.length-1);
        } else {
            Komodi.stage.setChildIndex(this.indicator, Komodi.stage.getChildIndex(block.graphic)-1);
        }

        let blockGlobal = block.graphic.getGlobalPosition();
        let currentMouse = getMousePoint();
        this.mouseOffset.x = currentMouse.x - blockGlobal.x;
        this.mouseOffset.y = currentMouse.y - blockGlobal.y;
        this.dragging = block;
        this.initialDrag = initialDrag;
        block.graphic.alpha = 0.8;
    }

    updateDragging() {
        if (this.dragging != null) {
            let mouse = getMousePoint();

            let globalX = mouse.x - this.mouseOffset.x;
            let globalY = mouse.y - this.mouseOffset.y;
            this.dragging.graphic.position = Komodi.stage.toLocal(new PIXI.Point(
                globalX, globalY
            ));

            let attachInfo = this.getNearestAttachPoint(globalX, globalY);
            if (attachInfo != null) {
                let globalPosition = attachInfo.target.graphic.getGlobalPosition();
                this.updateIndicator(globalX, globalY, globalPosition.x + attachInfo.x, globalPosition.y + attachInfo.y);
            } else {
                this.indicator.clear();
            }
        }
    }

    stopDragging() {
        if (this.dragging != null) {
            let globalPosition = this.dragging.graphic.getGlobalPosition();
            let attachInfo = this.getNearestAttachPoint(globalPosition.x, globalPosition.y);
            if (attachInfo != null) {
                attachInfo.target.attachBlock(attachInfo, this.dragging);
            } else if (this.initialDrag) {
                let position = this.dragging.graphic.getGlobalPosition();
                Komodi.stage.addChild(this.dragging.graphic);
                this.dragging.graphic.position = Komodi.stage.toLocal(position);
            }
            this.dragging.graphic.alpha = 1;
            this.dragging = null;

            this.indicator.clear();
        }
    }

    private updateIndicator(sx: number, sy: number, ex: number, ey: number) {
        this.indicator.clear();

        this.indicator.x = ex;
        this.indicator.y = ey;
        this.indicator.beginFill(INDICATOR_COLOR);
        this.indicator.drawCircle(0, 0, INDICATOR_RADIUS);

        let dx = sx-ex, dy = sy-ey;
        let radian = Math.atan2(dy, dx);
        this.indicator.moveTo(dx, dy);
        this.indicator.lineTo(Math.cos(radian + Math.PI/2) * INDICATOR_RADIUS, Math.sin(radian + Math.PI/2) * INDICATOR_RADIUS);
        this.indicator.lineTo(Math.cos(radian - Math.PI/2) * INDICATOR_RADIUS, Math.sin(radian - Math.PI/2) * INDICATOR_RADIUS);
        this.indicator.lineTo(dx, dy);
    }
}
