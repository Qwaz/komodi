import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {hitTestRectangle} from "../utils";
import {AttachInfo} from "../controllers/AttachController";

export abstract class FlowItem extends PIXI.Container {
    nextFlowItems: Array<FlowItem> = [];

    abstract drawBranch(): void;
    abstract editingPoints(): void;

    constructor() {
        super();

        // event handling
        this.on('mouseover', () => this.alpha = 0.85);
        this.on('mouseout', () => this.alpha = 1);
    }
}

export abstract class FlowElement extends FlowItem {
    abstract calculateElementSize(): void;
}

export class Signal extends FlowItem {
    constructor(private _shape: Shape) {
        super();

        // UI setup
        this.addChild(_shape.graphics.clone());
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
            }
        });

        this.on('mouseup', () => {
            if (Global.dragging == this) {
                Global.setDragging(null);

                if (hitTestRectangle(Global.menu, this)) {
                    this.destroy();
                }
            }
        });
    }

    destroy() {
        this.parent.removeChild(this);
    }

    get shape(): Shape {
        return this._shape;
    }

    drawBranch(): void {
    }

    editingPoints(): void {
    }
}

export class Block extends FlowElement {
    attachParent: AttachInfo | null = null;
    attachChildren: Array<Block | null> = [];

    highlights: PIXI.Graphics[];

    constructor(private _shape: BlockShape) {
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

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
                Global.attachController.detachBlock(this);
            }
        });

        this.on('mouseup', () => {
            if (Global.dragging == this) {
                Global.setDragging(null);

                if (hitTestRectangle(Global.menu, this)) {
                    this.destroy();
                } else {
                    Global.attachController.removeHighlight();

                    let attachInfo = Global.attachController.getNearestAttachPoint(
                        this.x,
                        this.y,
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
                child.x = this.x + offset.offsetX;
                child.y = this.y + offset.offsetY;
                child.updateChildrenPosition();
            }
        }
    }

    get shape(): BlockShape {
        return this._shape;
    }

    calculateElementSize(): void {
    }

    drawBranch(): void {
    }

    editingPoints(): void {
    }
}

export class FlowItemFactory<T extends FlowItem, S extends Shape> {
    constructor(private constructor: {new (shape: S): T}, readonly shape: S) {
    }

    createFlowItem(): T {
        return new this.constructor(this.shape);
    }
}