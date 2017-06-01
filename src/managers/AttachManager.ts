import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {Block, Control} from "../controls";
import {Komodi} from "../Global";
import {stagePositionOf} from "../utils";
import {Offset, TypedOffset, TypeRequirement} from "../common";
import {Scope} from "../scope/scope";

// algebraic data types for attach management
interface ScopeAttach {
    attachType: "Scope";
}

interface FlowAttach {
    attachType: "Flow";
}

interface LogicAttach {
    attachType: "Logic";
}

// attach info
interface ScopeAttachInfo extends ScopeAttach {
    attachTo: Control,
    attachIndex: number,
}

interface FlowAttachInfo extends FlowAttach {
    attachTo: Control,
}

interface LogicAttachInfo extends LogicAttach, TypeRequirement {
    attachTo: Block,
    attachIndex: number,
}

export type AttachInfo = ScopeAttachInfo | FlowAttachInfo | LogicAttachInfo;

// attach candidates
interface ScopeAttachCandidate extends ScopeAttach, Offset {
    attachIndex: number,
}

interface FlowAttachCandidate extends FlowAttach, Offset {
}

interface LogicAttachCandidate extends LogicAttach, TypedOffset {
    attachIndex: number,
}

export type AttachCandidate = ScopeAttachCandidate | FlowAttachCandidate | LogicAttachCandidate;

function getHighlightFromAttachInfo(attachInfo: AttachInfo): PIXI.Graphics {
    switch (attachInfo.attachType) {
        case "Scope":
            if (attachInfo.attachTo.scope) {
                return attachInfo.attachTo.scope.highlights[attachInfo.attachIndex];
            } else {
                throw new Error("Invalid AttachInfo");
            }
        case "Flow": return attachInfo.attachTo.flowHighlight;
        case "Logic": return attachInfo.attachTo.logicHighlights[attachInfo.attachIndex];
    }
}

export class AttachManager {
    private scopePoints: Map<Scope, ScopeAttachCandidate[]> = new Map<Scope, ScopeAttachCandidate[]>();
    private flowPoints: Map<Control, FlowAttachCandidate> = new Map<Control, FlowAttachCandidate>();
    private logicPoints: Map<Block, LogicAttachCandidate[]> = new Map<Block, LogicAttachCandidate[]>();

    private currentHighlight: AttachInfo | null = null;

    // ScopeAttach
    registerScope(scope: Scope) {
        this.scopePoints.set(scope, _.times(scope.numScope, (i): ScopeAttachCandidate => {
            return {
                attachType: "Scope",
                attachIndex: i,
                offsetX: 0,
                offsetY: 0,
            };
        }));
    }

    deleteScope(scope: Scope) {
        this.scopePoints.delete(scope);
    }

    updateScope(scope: Scope, index: number, offset: Offset) {
        scope.highlights[index].x = offset.offsetX;
        scope.highlights[index].y = offset.offsetY;

        let arr = this.scopePoints.get(scope);
        if (arr) {
            arr[index].offsetX = offset.offsetX;
            arr[index].offsetY = offset.offsetY;
        }
    }

    // FlowAttach
    registerFlow(_control: Control) {
    }

    deleteFlow(control: Control) {
        this.flowPoints.delete(control);
    }

    updateFlow(control: Control, offset: Offset) {
        this.flowPoints.set(control, {
            attachType: "Flow",
            offsetX: offset.offsetX,
            offsetY: offset.offsetY,
        });

        control.flowHighlight.x = offset.offsetX;
        control.flowHighlight.y = offset.offsetY;
    }

    // LogicAttach
    registerLogic(block: Block) {
        this.logicPoints.set(block, _.map(block.shape.highlightOffsets, (offset, i): LogicAttachCandidate => {
            return {
                attachType: "Logic",
                attachIndex: i,
                offsetX: offset.offsetX,
                offsetY: offset.offsetY,
                requiredType: offset.requiredType,
            };
        }));
    }

    deleteLogic(block: Block) {
        this.logicPoints.delete(block);
    }

    updateLogic(block: Block) {
        let arr = this.logicPoints.get(block);
        if (arr) {
            // update only registered offsets
            for (let i = 0; i < arr.length; i++) {
                let attachIndex = arr[i].attachIndex;

                let newOffset = block.shape.highlightOffsets[attachIndex];
                arr[i].offsetX = newOffset.offsetX;
                arr[i].offsetY = newOffset.offsetY;
                arr[i].requiredType = newOffset.requiredType;

                block.logicHighlights[attachIndex].x = newOffset.offsetX;
                block.logicHighlights[attachIndex].y = newOffset.offsetY;
            }
        }
    }

    setHighlight(attachInfo: AttachInfo) {
        this.removeHighlight();

        this.currentHighlight = attachInfo;
        let highlight = getHighlightFromAttachInfo(this.currentHighlight);
        highlight.visible = true;
    }

    removeHighlight() {
        if (this.currentHighlight) {
            let highlight = getHighlightFromAttachInfo(this.currentHighlight);
            highlight.visible = false;
            this.currentHighlight = null;
        }
    }

    getNearestAttachPoint(
        stageX: number, stageY: number,
        filter?: (attachInfo: AttachInfo) => boolean
    ): AttachInfo | null {
        const NEAR = 20;

        let result: AttachInfo | null = null;
        let resultDist = 0;

        let isValidCandidate = function (pivot: Control, candidate: AttachCandidate) {
            let stagePosition = stagePositionOf(pivot);

            let candX = stagePosition.x + candidate.offsetX;
            let candY = stagePosition.y + candidate.offsetY;

            let deltaX = Math.abs(stageX - candX);
            let deltaY = Math.abs(stageY - candY);
            let distance = deltaX + deltaY;

            return deltaX <= NEAR && deltaY <= NEAR && (result == null || distance <= resultDist);
        };

        let candidateDistance = function (pivot: Control, candidate: AttachCandidate) {
            let stagePosition = stagePositionOf(pivot);

            let candX = stagePosition.x + candidate.offsetX;
            let candY = stagePosition.y + candidate.offsetY;

            let deltaX = Math.abs(stageX - candX);
            let deltaY = Math.abs(stageY - candY);

            return deltaX + deltaY;
        };

        this.scopePoints.forEach((arr, scope) => {
            for (let candidate of arr) {
                if (isValidCandidate(scope.control, candidate)) {
                    let attachInfo: ScopeAttachInfo = {
                        attachType: "Scope",
                        attachTo: scope.control,
                        attachIndex: candidate.attachIndex,
                    };
                    if (!filter || filter(attachInfo)) {
                        result = attachInfo;
                        resultDist = candidateDistance(scope.control, candidate);
                    }
                }
            }
        });

        this.flowPoints.forEach((candidate, control) => {
            if (isValidCandidate(control, candidate)) {
                let attachInfo: FlowAttachInfo = {
                    attachType: "Flow",
                    attachTo: control,
                };
                if (!filter || filter(attachInfo)) {
                    result = attachInfo;
                    resultDist = candidateDistance(control, candidate);
                }
            }
        });

        this.logicPoints.forEach((arr, block) => {
            for (let candidate of arr) {
                if (isValidCandidate(block, candidate)) {
                    let attachInfo: LogicAttachInfo = {
                        attachType: "Logic",
                        attachTo: block,
                        attachIndex: candidate.attachIndex,
                        requiredType: candidate.requiredType,
                    };
                    if (!filter || filter(attachInfo)) {
                        result = attachInfo;
                        resultDist = candidateDistance(block, candidate);
                    }
                }
            }
        });

        return result;
    }

    attachControl(target: Control, attachInfo: AttachInfo) {
        switch (attachInfo.attachType) {
            case "Scope": {
                let parent = attachInfo.attachTo;
                if (parent.scope) {
                    let next = parent.scope.scopeChildren[attachInfo.attachIndex];
                    if (next) {
                        next.attachParent = {
                            attachType: "Flow",
                            attachTo: target,
                        };
                        target.flow = next;
                    }
                    parent.scope.scopeChildren[attachInfo.attachIndex] = target;
                    target.attachParent = attachInfo;

                    parent.addChild(target);
                } else {
                    throw new Error("Cannot attach to an empty scope");
                }
                break;
            }
            case "Flow": {
                let parent = attachInfo.attachTo;
                let next = parent.flow;
                if (next) {
                    next.attachParent = {
                        attachType: "Flow",
                        attachTo: target,
                    };
                    target.flow = next;
                }
                parent.flow = target;
                target.attachParent = attachInfo;

                parent.parent.addChild(target);
                break;
            }
            case "Logic": {
                if (target instanceof Block) {
                    let parent = attachInfo.attachTo;
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

                    parent.addChild(target);
                } else {
                    throw new Error("Target of LogicAttach should be an instance of Block")
                }
                break;
            }
        }

        target.findScopeRoot().update();
    }

    detachControl(target: Control) {
        Komodi.stage.addChild(target);

        let attachInfo = target.attachParent;
        if (attachInfo) {
            switch (attachInfo.attachType) {
                case "Scope":{
                    let parent = attachInfo.attachTo;
                    if (parent.scope) {
                        parent.scope.scopeChildren[attachInfo.attachIndex] = target.flow;
                        if (target.flow) {
                            target.flow.attachParent = target.attachParent;
                            target.flow = null;
                        }
                        target.attachParent = null;
                    } else {
                        throw new Error("Cannot detach from an empty scope");
                    }
                    break;
                }
                case "Flow": {
                    let parent = attachInfo.attachTo;
                    parent.flow = target.flow;
                    if (target.flow) {
                        target.flow.attachParent = target.attachParent;
                        target.flow = null;
                    }
                    target.attachParent = null;
                    break;
                }
                case "Logic": {
                    let parent = attachInfo.attachTo;
                    parent.logicChildren[attachInfo.attachIndex] = null;
                    target.attachParent = null;

                    parent.updateShape();

                    let arr = this.logicPoints.get(parent);
                    if (arr) {
                        let offset = parent.shape.highlightOffsets[attachInfo.attachIndex];
                        arr.push({
                            attachType: "Logic",
                            attachIndex: attachInfo.attachIndex,
                            offsetX: offset.offsetX,
                            offsetY: offset.offsetY,
                            requiredType: offset.requiredType,
                        });
                    }
                    break;
                }
            }

            attachInfo.attachTo.findScopeRoot().update();
        }
    }
}