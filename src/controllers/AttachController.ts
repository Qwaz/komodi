import {Block} from "../ui/flow";

export interface AttachInfo {
    attachTo: Block;
    attachIndex: number;
}

// Offset information is redundant, but used as cache
export interface Offset {
    offsetX: number;
    offsetY: number;
}

export interface AttachCandidates extends Offset {
    attachIndex: number;
}

export class AttachController {
    private attachPoints: Map<Block, AttachCandidates[]> = new Map<Block, AttachCandidates[]>();
    private currentHighlight: AttachInfo | null = null;

    registerAttachPoints(block: Block, offsets: Offset[]) {
        this.attachPoints.set(block, []);
        for (let i = 0; i < offsets.length; i++) {
            this.attachPoints.get(block).push({
                attachIndex: i,
                offsetX: offsets[i].offsetX,
                offsetY: offsets[i].offsetY,
            });
        }
    }

    deleteBlock(block: Block) {
        this.attachPoints.delete(block);
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
        return attachInfo.attachTo.highlights[attachInfo.attachIndex];
    }

    getNearestAttachPoint(stageX: number, stageY: number): AttachInfo | null {
        const NEAR = 20;

        let result: AttachInfo | null = null;
        let resultDist = 0;

        this.attachPoints.forEach((arr, block) => {
            for (let candidates of arr) {
                let candX = block.x + candidates.offsetX;
                let candY = block.y + candidates.offsetY;

                let deltaX = Math.abs(stageX - candX);
                let deltaY = Math.abs(stageY - candY);

                if (deltaX <= NEAR && deltaY <= NEAR) {
                    let distance = deltaX + deltaY;
                    if (result == null || distance <= resultDist) {
                        result = {
                            attachTo: block,
                            attachIndex: candidates.attachIndex,
                        };
                        resultDist = distance;
                    }
                }
            }
        });

        return result;
    }

    attachBlock(target: Block, attachInfo: AttachInfo) {
        let parent = attachInfo.attachTo;
        parent.attachChildren[attachInfo.attachIndex] = target;
        target.attachParent = attachInfo;

        parent.updateChildrenPosition();

        let arr = this.attachPoints.get(parent);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].attachIndex == attachInfo.attachIndex) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    detachBlock(target: Block) {
        let attachInfo = target.attachParent;

        if (attachInfo) {
            let parent = attachInfo.attachTo;
            parent.attachChildren[attachInfo.attachIndex] = null;
            target.attachParent = null;

            parent.updateChildrenPosition();

            let offset = parent.shape.highlightOffsets[attachInfo.attachIndex];

            let arr = this.attachPoints.get(parent);
            arr.push({
                attachIndex: attachInfo.attachIndex,
                offsetX: offset.offsetX,
                offsetY: offset.offsetY,
            });
        }
    }
}