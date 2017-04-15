import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {hitTestRectangle, moveToTop} from "../utils";
import {AttachInfo, AttachType} from "../controllers/AttachController";
import {FlowStrategy, generateFlowHighlights, splitJoinStrategy} from "../controllers/flowStrategies";

export abstract class FlowControl extends PIXI.Container {
    private _flowHighlights: PIXI.Graphics[];

    get numFlow(): number {
        return this.flowChildren.length-1;
    }

    attachParent: AttachInfo | null = null;
    flowChildren: Array<FlowControl | null>;

    constructor(
        numFlow: number,
        public flowStrategy: FlowStrategy,
    ) {
        super();

        this.flowChildren = [];
        for (let i = 0; i < numFlow+1; i++) {
            this.flowChildren.push(null);
        }
        Global.attachController.registerFlowControl(this);
        Global.flowController.registerControl(this);

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
            this._flowHighlights = generateFlowHighlights(this);
        }
        return this._flowHighlights;
    }

    // TODO: improve performance of finding flow root
    findFlowRoot(): FlowControl {
        let now: FlowControl = this;
        while (now.attachParent) {
            now = now.attachParent.attachTo;
        }

        return now;
    }

    hasFlowParent(): boolean {
        return !!this.attachParent && this.attachParent.attachType == AttachType.FLOW;
    }

    calculateElementSize(): PIXI.Rectangle {
        this.updateControl();

        let bound = this.getBounds();
        for (let i = 1; i <= this.numFlow; i++) {
            let now = this.flowChildren[i];
            while (now) {
                bound.enlarge(now.calculateElementSize());
                now = now.flowChildren[0];
            }
        }
        return bound;
    }

    destroy() {
        this.parent.removeChild(this);

        Global.attachController.deleteFlowControl(this);
        Global.flowController.deleteControl(this);

        for (let control of this.flowChildren) {
            if (control) {
                control.destroy();
            }
        }
    }

    updateControl() {
        moveToTop(this);
        Global.flowController.update(this);
    }
}

export class Signal extends FlowControl {
    constructor(private _shape: Shape) {
        super(1, splitJoinStrategy);

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

    get shape(): Shape {
        return this._shape;
    }
}

export abstract class Block extends FlowControl {
    logicChildren: Array<Block | null> = [];
    logicHighlights: PIXI.Graphics[];

    constructor(
        private _shape: BlockShape,
        numFlow: number,
        flowStrategy: FlowStrategy,
    ) {
        super(numFlow, flowStrategy);

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

    updateControl() {
        super.updateControl();

        for (let i = 0; i < this._shape.highlightOffsets.length; i++) {
            let offset = this._shape.highlightOffsets[i];
            let child = this.logicChildren[i];
            if (child) {
                child.x = this.x + offset.offsetX;
                child.y = this.y + offset.offsetY;
                child.updateControl();
            }
        }
    }

    get shape(): BlockShape {
        return this._shape;
    }

    calculateElementSize(): PIXI.Rectangle {
        let bounds = super.calculateElementSize();
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