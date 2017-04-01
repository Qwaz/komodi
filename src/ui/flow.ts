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
    attachParent: AttachInfo | null;
    attachChildren: Array<Block | null>;

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
        }

        Global.attachController.registerAttachPoints(this, _shape.highlightOffsets);

        // event handling
        this.on('mouseover', () => this.alpha = 0.7);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.dragging = this;
                this.parent.addChild(this);
                // TODO: Block detach logic
            }
        });

        this.on('mouseup', () => {
            if (Global.dragging == this) {
                Global.dragging = null;

                // TODO: Block attach logic

                if (hitTestRectangle(Global.menu, this)) {
                    this.destroy();
                }
            }
        });
    }

    destroy() {
        this.parent.removeChild(this);
        Global.attachController.deleteBlock(this);

        for (let i = 0; i < this.attachChildren.length; i++) {
            let child = this.attachChildren[i];
            if (child != null) {
                this.attachChildren[i] = null;
                child.destroy();
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