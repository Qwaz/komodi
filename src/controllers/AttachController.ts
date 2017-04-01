import {Block} from "../ui/flow";

export interface AttachInfo {
    attachedTo: Block;
    attachIndex: number;
}

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
        this.currentHighlight = attachInfo;
        let highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
        highlight.visible = true;
    }

    removeHighlight() {
        if (this.currentHighlight != null) {
            let highlight = this.getHighlightFromAttachInfo(this.currentHighlight);
            highlight.visible = false;
            this.currentHighlight = null;
        }
    }

    getHighlightFromAttachInfo(attachInfo: AttachInfo): PIXI.Graphics {
        return attachInfo.attachedTo.highlights[attachInfo.attachIndex];
    }

    getNearestAttachPoint(stageX: number, stageY: number): AttachInfo | null {
        const NEAR = 20;

        this.removeHighlight();

        let result: AttachInfo | null = null;
        let resultDist = 0;

        this.attachPoints.forEach((arr, block) => {
            let globalPosition = block.getGlobalPosition();
            for (let candidates of arr) {
                let candX = globalPosition.x + candidates.offsetX;
                let candY = globalPosition.y + candidates.offsetY;

                let deltaX = Math.abs(stageX - candX);
                let deltaY = Math.abs(stageY - candY);

                if (deltaX <= NEAR && deltaY <= NEAR) {
                    let distance = deltaX + deltaY;
                    if (result == null || distance <= resultDist) {
                        result = {
                            attachedTo: block,
                            attachIndex: candidates.attachIndex,
                        };
                        resultDist = distance;
                    }
                }
            }
        });

        if (result != null) {
            this.setHighlight(result);
        }
        return result;
    }
}