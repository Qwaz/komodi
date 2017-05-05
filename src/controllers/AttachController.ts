import * as PIXI from "pixi.js";
import {Block, FlowControl} from "../ui/flow";
import {Global} from "../entry";
import {TypeInfo} from "../type/type";
import {globalPositionOf} from "../utils";

export enum AttachType {
    FLOW,
    LOGIC,
}

export interface AttachInfo {
    attachType: AttachType;
    attachTo: FlowControl;
    attachIndex: number;
}

// Offset information is redundant, but used as cache
export interface Offset {
    offsetX: number;
    offsetY: number;
}

export interface TypedOffset extends Offset {
    requiredType?: TypeInfo;
}

export interface AttachCandidates extends TypedOffset {
    attachType: AttachType;
    attachIndex: number;
}

export class AttachController {
    private logicPoints: Map<Block, AttachCandidates[]> = new Map<Block, AttachCandidates[]>();
    private flowPoints: Map<FlowControl, AttachCandidates[]> = new Map<FlowControl, AttachCandidates[]>();
    private currentHighlight: AttachInfo | null = null;

    registerBlock(block: Block, offsets: TypedOffset[]) {
        this.logicPoints.set(block, []);
        for (let i = 0; i < offsets.length; i++) {
            let candidates = this.logicPoints.get(block);
            candidates && candidates.push({
                attachType: AttachType.LOGIC,
                attachIndex: i,
                offsetX: offsets[i].offsetX,
                offsetY: offsets[i].offsetY,
                requiredType: offsets[i].requiredType,
            });
        }
    }

    deleteBlock(block: Block) {
        this.logicPoints.delete(block);
    }

    registerFlowControl(control: FlowControl) {
        this.flowPoints.set(control, []);
        for (let i = 0; i < control.numFlow+1; i++) {
            let candidates = this.flowPoints.get(control);
            candidates && candidates.push({
                attachType: AttachType.FLOW,
                attachIndex: i,
                offsetX: 0,
                offsetY: 0,
            });
        }
    }

    deleteFlowControl(control: FlowControl) {
        this.flowPoints.delete(control);
    }

    updateLogicOffset(block: Block) {
        let arr = this.logicPoints.get(block);
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                let attachIndex = arr[i].attachIndex;

                let newOffset = block.shape.highlightOffsets[attachIndex];
                arr[i].offsetX = newOffset.offsetX;
                arr[i].offsetY = newOffset.offsetY;

                block.logicHighlights[attachIndex].x = newOffset.offsetX;
                block.logicHighlights[attachIndex].y = newOffset.offsetY;
            }
        }
    }

    updateFlowOffset(control: FlowControl, index: number, offset: Offset) {
        control.flowHighlights[index].x = offset.offsetX;
        control.flowHighlights[index].y = offset.offsetY;

        let arr = this.flowPoints.get(control);
        if (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].attachIndex == index) {
                    arr[i].offsetX = offset.offsetX;
                    arr[i].offsetY = offset.offsetY;
                    break;
                }
            }
        }
    }

    setHighlight(attachInfo: AttachInfo) {
        this.removeHighlight();

        this.currentHighlight = attachInfo;
        let highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
        highlight.visible = true;
    }

    removeHighlight() {
        if (this.currentHighlight) {
            let highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
            highlight.visible = false;
            this.currentHighlight = null;
        }
    }

    getHighlightFromAttachInfo(attachInfo: AttachInfo): PIXI.Graphics {
        if (attachInfo.attachType == AttachType.FLOW) {
            return attachInfo.attachTo.flowHighlights[attachInfo.attachIndex];
        } else if (attachInfo.attachType == AttachType.LOGIC) {
            return (attachInfo.attachTo as Block).logicHighlights[attachInfo.attachIndex];
        } else {
            throw new TypeError("Unknown Attach Type");
        }
    }

    getNearestAttachPoint(
        stageX: number, stageY: number,
        filter?: (attachInfo: AttachInfo, requiredType?: TypeInfo) => boolean
    ): AttachInfo | null {
        const NEAR = 20;

        let result: AttachInfo | null = null;
        let resultDist = 0;

        this.logicPoints.forEach((arr, block) => {
            let globalPosition = globalPositionOf(block);
            for (let candidate of arr) {
                let candX = globalPosition.x + candidate.offsetX;
                let candY = globalPosition.y + candidate.offsetY;

                let deltaX = Math.abs(stageX - candX);
                let deltaY = Math.abs(stageY - candY);

                if (deltaX <= NEAR && deltaY <= NEAR) {
                    let attachInfo = {
                        attachType: AttachType.LOGIC,
                        attachTo: block,
                        attachIndex: candidate.attachIndex,
                    };

                    let distance = deltaX + deltaY;
                    if ((result == null || distance <= resultDist)
                        && (filter ? filter(attachInfo, candidate.requiredType) : true)) {
                        result = attachInfo;
                        resultDist = distance;
                    }
                }
            }
        });

        this.flowPoints.forEach((arr, control) => {
            let globalPosition = globalPositionOf(control);
            for (let candidate of arr) {
                if ((candidate.attachIndex == 0 && !control.hasFlowParent())) {
                    continue;
                }

                let candX = globalPosition.x + candidate.offsetX;
                let candY = globalPosition.y + candidate.offsetY;

                let deltaX = Math.abs(stageX - candX);
                let deltaY = Math.abs(stageY - candY);

                if (deltaX <= NEAR && deltaY <= NEAR) {
                    let attachInfo = {
                        attachType: AttachType.FLOW,
                        attachTo: control,
                        attachIndex: candidate.attachIndex,
                    };

                    let distance = deltaX + deltaY;
                    if ((result == null || distance <= resultDist)
                        && (filter ? filter(attachInfo, candidate.requiredType) : true)) {
                        result = attachInfo;
                        resultDist = distance;
                    }
                }
            }
        });

        return result;
    }

    attachControl(target: FlowControl, attachInfo: AttachInfo) {
        let parent = attachInfo.attachTo;
        if (attachInfo.attachType == AttachType.LOGIC) {
            if (parent instanceof Block && target instanceof Block) {
                parent.logicChildren[attachInfo.attachIndex] = target;
                target.attachParent = attachInfo;

                let arr = this.logicPoints.get(parent);
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].attachIndex == attachInfo.attachIndex) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                }

                // update display
                parent.addChild(target);
            } else {
                throw new TypeError("attachType and attachTo do not match");
            }
        } else if (attachInfo.attachType == AttachType.FLOW) {
            let next = parent.flowChildren[attachInfo.attachIndex];
            if (next) {
                next.attachParent = {
                    attachTo: target,
                    attachType: AttachType.FLOW,
                    attachIndex: 0,
                };
                target.flowNext = next;
            }
            parent.flowChildren[attachInfo.attachIndex] = target;
            target.attachParent = attachInfo;

            // update display
            if (attachInfo.attachIndex == 0) {
                parent.parent.addChild(target);
            } else {
                parent.addChild(target);
            }
        }

        let flowRoot = parent.findFlowRoot();
        flowRoot.updateControl();
    }

    detachControl(target: FlowControl) {
        let attachInfo = target.attachParent;

        if (attachInfo) {
            let parent = attachInfo.attachTo;

            if (attachInfo.attachType == AttachType.LOGIC) {
                if (parent instanceof Block) {
                    parent.logicChildren[attachInfo.attachIndex] = null;
                    target.attachParent = null;

                    parent.updateControl();
                    let offset = parent.shape.highlightOffsets[attachInfo.attachIndex];

                    let arr = this.logicPoints.get(parent);
                    if (arr) {
                        arr.push({
                            attachType: AttachType.LOGIC,
                            attachIndex: attachInfo.attachIndex,
                            offsetX: offset.offsetX,
                            offsetY: offset.offsetY,
                            requiredType: offset.requiredType,
                        });
                    }
                } else {
                    throw new TypeError("attachType and attachTo do not match");
                }
            } else if (attachInfo.attachType == AttachType.FLOW) {
                parent.flowChildren[attachInfo.attachIndex] = target.flowNext;
                if (target.flowNext) {
                    target.flowNext.attachParent = target.attachParent;
                    target.flowNext = null;
                }
                target.attachParent = null;
            }

            // update display
            Global.stage.addChild(target);

            let flowRoot = parent.findFlowRoot();
            flowRoot.updateControl();
        }
    }
}