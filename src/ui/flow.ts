import Shape from "../shape/Shape";
import {Global} from "../entry";
import {hitTestRectangle} from "../utils";
import {AttachInfo} from "../controllers/AttachController";

export abstract class FlowItem extends PIXI.Container {
    nextFlowItems: Array<FlowItem> = [];

    abstract drawBranch(): void;
    abstract editingPoints(): void;
}

export abstract class FlowElement extends FlowItem {
    abstract calculateElementSize(): void;
}

export abstract class Block extends FlowElement {
    attachParent: AttachInfo | null = null;
    attachChildren: Array<Block | null> = [];

    highlights: PIXI.Graphics[];

    constructor(private _shape: Shape) {
        super();

        // UI setup
        this.addChild(_shape.graphics.clone());
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        // attach management
        this.highlights = [];

        for (let highlight of _shape.highlightGraphics) {
            let clone = highlight.clone();
            this.highlights.push(clone);
            this.addChild(clone);
            clone.visible = false;

            this.attachChildren.push(null);
        }

        Global.attachController.registerAttachPoints(this, _shape.highlightOffsets);

        // event handling
        this.on('mouseover', () => this.alpha = 0.85);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.dragging = this;
                Global.attachController.detachBlock(this);
            }
        });

        this.on('mouseup', () => {
            if (Global.dragging == this) {
                Global.dragging = null;

                if (hitTestRectangle(Global.menu, this)) {
                    this.destroy();
                } else {
                    Global.attachController.removeHighlight();

                    let attachInfo = Global.attachController.getNearestAttachPoint(
                        this.x + this._shape.pivot.offsetX,
                        this.y + this._shape.pivot.offsetY,
                    );

                    if (attachInfo) {
                        Global.attachController.attachBlock(this, attachInfo);
                    }
                }
            }
        });
    }

    destroy() {
        this.parent.removeChild(this);
        Global.attachController.deleteBlock(this);

        for (let i = 0; i < this.attachChildren.length; i++) {
            let child = this.attachChildren[i];
            if (child) {
                this.attachChildren[i] = null;
                child.destroy();
            }
        }
    }

    updateChildrenPosition() {
        this.parent.setChildIndex(this, this.parent.children.length-1);
        for (let i = 0; i < this._shape.highlightOffsets.length; i++) {
            let offset = this._shape.highlightOffsets[i];
            let child = this.attachChildren[i];
            if (child) {
                child.x = this.x + offset.offsetX - child._shape.pivot.offsetX;
                child.y = this.y + offset.offsetY - child._shape.pivot.offsetY;
                child.updateChildrenPosition();
            }
        }
    }

    get shape(): Shape {
        return this._shape;
    }
}

export class FlowItemFactory<T extends FlowItem> {
    constructor(private constructor: {new (shape: Shape): T}, readonly shape: Shape) {
    }

    createFlowItem(): T {
        return new this.constructor(this.shape);
    }
}