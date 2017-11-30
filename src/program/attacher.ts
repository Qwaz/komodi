import * as _ from "lodash";
import {ArgumentAttach, AttachInfo, Block, Command, Expression, ScopeAttach, Signal} from "./index";
import {Coordinate} from "../common/definition";
import {getMousePoint} from "../common/utils";
import {Komodi} from "../global";
import {ExpressionToken} from "../graphic/index";

interface AttachSet {
    argumentAttach: Map <string, ArgumentAttach & Coordinate>;
    scopeAttach: Map <string, (ScopeAttach & Coordinate)[]>;
}

export class Attacher {
    initialDrag: boolean = false;
    dragging: Block | null = null;
    mouseOffset: Coordinate = { x: 0, y: 0 };

    private indicator = new PIXI.Graphics();

    private map: Map <Block, AttachSet> = new Map();

    init() {
        Komodi.container.addChild(this.indicator);
        this.indicator.alpha = 0.6;

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

    setArgumentCoordinate(block: Block, argumentName: string, coord: Coordinate) {
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

    removeArgumentCoordinate(block: Block, argumentName: string) {
        let argumentAttach = this.map.get(block)!.argumentAttach;
        if (argumentAttach.has(argumentName)) {
            this.map.get(block)!.argumentAttach.delete(argumentName);
        }
    }

    setScopeCoordinate(block: Block, scopeName: string, coordinates: Coordinate[]) {
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
        const NEAR = 60;

        if (this.dragging instanceof Signal) {
            return null;
        }

        let distance = Infinity;
        let attachPoint: AttachInfo | null = null;

        const updateDistance = (info: AttachInfo & Coordinate) => {
            let globalPosition = info.target.graphic.toGlobal(new PIXI.Point(info.x, info.y));
            let candidateDistance = Math.abs(globalPosition.x - stageX) + Math.abs(globalPosition.y - stageY);

            if (candidateDistance < NEAR && candidateDistance < distance && info.target != this.dragging) {
                distance = candidateDistance;
                attachPoint = info;
            }
        };

        this.map.forEach((attach, target) => {
            if (this.dragging instanceof Expression) {
                for (let [argumentName, info] of attach.argumentAttach) {
                    let token = <ExpressionToken>target.definition.tokens.find((token) =>
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
        });

        return _.clone(attachPoint);
    }

    setDragging(block: Block, initialDrag: boolean = false) {
        if (this.dragging != null) {
            return;
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
                console.log('out');
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
        const RADIUS = 5;

        this.indicator.clear();

        this.indicator.x = sx;
        this.indicator.y = sy;
        this.indicator.beginFill(0xFF0000);
        this.indicator.drawCircle(0, 0, RADIUS);

        let dx = ex-sx, dy = ey-sy;
        let radian = Math.atan2(dy, dx);
        this.indicator.moveTo(dx, dy);
        this.indicator.lineTo(Math.cos(radian + Math.PI/2) * RADIUS, Math.sin(radian + Math.PI/2) * RADIUS);
        this.indicator.lineTo(Math.cos(radian - Math.PI/2) * RADIUS, Math.sin(radian - Math.PI/2) * RADIUS);
        this.indicator.lineTo(dx, dy);
    }
}
