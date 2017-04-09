import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {hitTestRectangle} from "../utils";
import {AttachInfo, AttachType} from "../controllers/AttachController";
import {FlowStrategy, noStrategy} from "../controllers/flowStrategies";
import {Flow} from "../controllers/FlowController";

export abstract class FlowControl extends PIXI.Container {
    private _flowHighlights: PIXI.Graphics[];

    get numFlow(): number {
        return this.flowChildren.length-1;
    }

    attachParent: AttachInfo | null = null;

    constructor(
        public flowChildren: Array<FlowControl | null>,
        public flowStrategy: FlowStrategy,
    ) {
        super();

        flowChildren.unshift(null); // default flow
        Global.attachController.registerFlowControl(this);

        // event handling
        this.on('mouseover', () => this.alpha = 0.85);
        this.on('mouseout', () => this.alpha = 1);
    }

    get flowNext(): FlowControl | null {
        return this.flowChildren[0];
    }

    set flowNext(val: FlowControl | null) {
        this.flowChildren[0] = val;
    }

    get flowHighlights(): PIXI.Graphics[] {
        if (!this._flowHighlights) {
            this._flowHighlights = Flow.generateFlowHighlights(this);
        }
        return this._flowHighlights;
    }

    // TODO: improve performance of finding flow root
    findFlowRoot(): Signal | null {
        let now: FlowControl = this;
        while (now.attachParent) {
            now = now.attachParent.attachTo;
        }

        if (now instanceof Signal) {
            return now;
        } else {
            return null;
        }
    }

    hasFlowParent(): boolean {
        return this instanceof Signal || (!!this.attachParent && this.attachParent.attachType == AttachType.FLOW);
    }

    calculateElementSize(): PIXI.Rectangle {
        return this.getBounds();
    }

    destroy() {
        this.parent.removeChild(this);

        Global.attachController.deleteFlowControl(this);

        for (let control of this.flowChildren) {
            if (control) {
                control.destroy();
            }
        }
    }
}

export class Signal extends FlowControl {
    constructor(private _shape: Shape) {
        super([], noStrategy);

        // UI setup
        this.addChild(_shape.graphics.clone());
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
            }
        });

        // flow management
        Global.flowController.registerSignal(this);

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
        super.destroy();

        Global.flowController.deleteSignal(this);
    }

    get shape(): Shape {
        return this._shape;
    }
}

export abstract class Block extends FlowControl {
    logicChildren: Array<Block | null> = [];
    logicHighlights: PIXI.Graphics[];

    constructor(
        private _shape: BlockShape,
        flowChildren: Array<FlowControl | null>,
        flowStrategy: FlowStrategy,
    ) {
        super(flowChildren, flowStrategy);

        // UI setup
        this.addChild(_shape.graphics.clone());
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        // attach management
        this.logicHighlights = [];

        for (let highlight of _shape.highlightGraphics) {
            let clone = highlight.clone();
            this.logicHighlights.push(clone);
            this.addChild(clone);
            clone.visible = false;

            this.logicChildren.push(null);
        }

        Global.attachController.registerBlock(this, _shape.highlightOffsets);

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
                        this,
                    );

                    if (attachInfo) {
                        Global.attachController.attachBlock(this, attachInfo);
                    }
                }
            }
        });
    }

    destroy() {
        super.destroy();

        Global.attachController.deleteBlock(this);

        for (let block of this.logicChildren) {
            if (block) {
                block.destroy();
            }
        }
    }

    updateChildrenPosition() {
        this.parent.setChildIndex(this, this.parent.children.length-1);
        for (let i = 0; i < this._shape.highlightOffsets.length; i++) {
            let offset = this._shape.highlightOffsets[i];
            let child = this.logicChildren[i];
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

    calculateElementSize(): PIXI.Rectangle {
        let bounds = this.getBounds();
        for (let block of this.logicChildren) {
            if (block) {
                bounds.enlarge(block.calculateElementSize());
            }
        }
        return bounds;
    }
}

export class FlowItemFactory<T extends FlowControl, S extends Shape> {
    constructor(private constructor: {new (shape: S): T}, readonly shape: S) {
    }

    createFlowItem(): T {
        return new this.constructor(this.shape);
    }
}