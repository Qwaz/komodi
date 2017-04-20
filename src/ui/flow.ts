import * as PIXI from "pixi.js";
import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {hitTestRectangle, moveToTop} from "../utils";
import {AttachInfo, AttachType} from "../controllers/AttachController";
import {FlowStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {FlowHighlight, LogicHighlight} from "../shape/Highlight";

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
            this._flowHighlights = [];
            for (let i = 0; i < this.numFlow+1; i++) {
                let highlight = new FlowHighlight();
                highlight.visible = false;
                this.addChild(highlight);
                this._flowHighlights.push(highlight);
            }
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

    protected updateControl() {
        moveToTop(this);
        Global.flowController.update(this);
    }

    updateAndGetBounds(): PIXI.Rectangle {
        this.updateControl();

        let bound = this.getBounds();
        for (let i = 1; i <= this.numFlow; i++) {
            let now = this.flowChildren[i];
            while (now) {
                bound.enlarge(now.updateAndGetBounds());
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
        this.addChild(_shape.graphics);
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        // attach management
        this.logicHighlights = [];

        for (let offset of _shape.highlightOffsets) {
            let highlight = new LogicHighlight();
            this.addChild(highlight);
            highlight.x = offset.offsetX;
            highlight.y = offset.offsetY;
            highlight.visible = false;

            this.logicHighlights.push(highlight);
            this.logicChildren.push(null);
        }

        Global.attachController.registerBlock(this, _shape.highlightOffsets);

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
                Global.attachController.detachControl(this);
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
                        this,
                        this.x,
                        this.y,
                    );

                    if (attachInfo) {
                        Global.attachController.attachControl(this, attachInfo);
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

    get shape(): BlockShape {
        return this._shape;
    }

    private updateShape() {
        this._shape.updateShape(this.logicChildren);
        this.hitArea = this._shape.hitArea;

        Global.attachController.updateLogicOffset(this);
        for (let i = 0; i < this._shape.highlightOffsets.length; i++) {
            let offset = this._shape.highlightOffsets[i];
            this.logicHighlights[i].x = offset.offsetX;
            this.logicHighlights[i].y = offset.offsetY;
        }
    }

    protected updateControl() {
        super.updateControl();
        this.updateShape();

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

    updateAndGetBounds(): PIXI.Rectangle {
        let bounds = super.updateAndGetBounds();
        for (let block of this.logicChildren) {
            if (block) {
                bounds.enlarge(block.updateAndGetBounds());
            }
        }
        return bounds;
    }
}

const OUTLINE_PADDING = 6;

export class Declaration extends FlowControl {
    private outline: PIXI.Graphics;

    constructor(
        private _shape: Shape
    ) {
        super(1, splitJoinStrategy);

        // UI setup
        this.addChild(_shape.graphics.clone());
        this.interactive = true;
        this.hitArea = _shape.hitArea;

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
                Global.attachController.detachControl(this);
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
                        this,
                        this.x,
                        this.y,
                    );

                    if (attachInfo) {
                        Global.attachController.attachControl(this, attachInfo);
                    }
                }
            }
        });

        this.outline = new PIXI.Graphics();
        this.addChildAt(this.outline, 0);
    }

    get shape(): Shape {
        return this._shape;
    }

    protected updateControl() {
        this.outline.clear();
        super.updateControl();
    }

    updateAndGetBounds(): PIXI.Rectangle {
        let bounds = super.updateAndGetBounds();

        this.outline.lineStyle(1, 0x9E9E9E);
        this.outline.drawRect(
            bounds.x - this.x - OUTLINE_PADDING, -2,
            bounds.width + OUTLINE_PADDING*2, bounds.bottom - this.y + 2
        );
        bounds.pad(OUTLINE_PADDING, 0);

        return bounds;
    }
}

export class FlowItemFactory<T extends FlowControl, S extends Shape> {
    constructor(private constructor: {new (shape: S): T}, readonly shape: S) {
    }

    createFlowItem(): T {
        return new this.constructor(this.shape.clone());
    }
}