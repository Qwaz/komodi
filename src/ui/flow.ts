import * as PIXI from "pixi.js";
import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {enableHighlight, hitTestRectangle, makeTargetInteractive} from "../utils";
import {AttachInfo, AttachType} from "../controllers/AttachController";
import {createParameterStrategy, FlowStrategy, noStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {FlowHighlight, LogicHighlight} from "../shape/Highlight";
import {TVoid, TypeInfo} from "../type/type";
import {Logic} from "../logic/logic";
import {ScopeInformation} from "./ScopeGenerator";

export abstract class FlowControl extends PIXI.Container {
    abstract get logic(): Logic;

    private _flowHighlights: PIXI.Graphics[];

    get numFlow(): number {
        return this.flowChildren.length-1;
    }

    attachParent: AttachInfo | null = null;
    flowChildren: Array<FlowControl | null>;

    constructor(
        readonly shape: Shape,
        numFlow: number,
        public flowStrategy: FlowStrategy,
    ) {
        super();

        // UI Setup
        this.addChild(shape);

        this.flowChildren = [];
        for (let i = 0; i < numFlow+1; i++) {
            this.flowChildren.push(null);
        }
        Global.attachController.registerFlowControl(this);
        Global.flowController.registerControl(this);

        // event handling
        makeTargetInteractive(this);
        makeTargetInteractive(this.shape);
        enableHighlight(this.shape);

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
                        this.x, this.y,
                        this.attachFilter.bind(this)
                    );

                    if (attachInfo) {
                        Global.attachController.attachControl(this, attachInfo);
                    }
                }
            }
        });
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

    updateControl() {
        Global.flowController.update(this);
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

    attachFilter({}: AttachInfo, {}: TypeInfo): boolean {
        return false;
    }
}

export class Signal extends FlowControl {
    constructor(readonly logic: Logic, shape: Shape) {
        super(shape, 1, splitJoinStrategy);

        Global.logicController.registerSignal(this);
    }

    destroy() {
        super.destroy();

        Global.logicController.deleteSignal(this);
    }
}

export abstract class Block extends FlowControl {
    logicChildren: Array<Block | null> = [];
    logicHighlights: LogicHighlight[];

    get numLogic(): number {
        return this.logicChildren.length;
    }

    constructor(
        readonly logic: Logic,
        readonly shape: BlockShape,
        numFlow: number,
        flowStrategy: FlowStrategy,
    ) {
        super(shape, numFlow, flowStrategy);

        // attach management
        this.logicHighlights = [];

        for (let offset of shape.highlightOffsets) {
            let highlight = new LogicHighlight();
            this.addChild(highlight);
            highlight.x = offset.offsetX;
            highlight.y = offset.offsetY;
            highlight.visible = false;

            this.logicHighlights.push(highlight);
            this.logicChildren.push(null);
        }

        Global.attachController.registerBlock(this, shape.highlightOffsets);
    }

    updateControl() {
        super.updateControl();

        this.shape.updateShape(this.logicChildren);

        Global.attachController.updateLogicOffset(this);

        for (let i = 0; i < this.numLogic; i++) {
            let offset = this.shape.highlightOffsets[i];
            let child = this.logicChildren[i];
            if (child) {
                child.x = offset.offsetX;
                child.y = offset.offsetY;
            }
        }
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

    attachFilter({}: AttachInfo, requiredType: TypeInfo): boolean {
        return requiredType ? this.shape.returnType.fitsTo(requiredType) : true;
    }
}

export class SimpleBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 0, noStrategy);
    }
}

export class Declaration extends Block {
    private scopeInfoArr: ScopeInformation[];

    constructor(
        logic: Logic,
        shape: BlockShape
    ) {
        let scopeInfoArr = [{
            returnType: new TVoid(),
            label: `local`,
        }];
        super(logic, shape, 1, createParameterStrategy(scopeInfoArr));

        this.scopeInfoArr = scopeInfoArr;
    }

    updateControl() {
        let logicChild = this.logicChildren[0];
        this.scopeInfoArr[0].returnType = logicChild ? logicChild.shape.returnType : new TVoid();

        super.updateControl();
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        return attachInfo.attachType == AttachType.FLOW;
    }
}

export class FlowItemFactory<F extends FlowControl, L extends Logic, S extends Shape> {
    constructor(protected constructor: {new (logic: L, shape: S): F}, readonly logic: L, readonly shape: S) {
    }

    createFlowItem(): F {
        return new this.constructor(this.logic, this.shape.clone());
    }
}