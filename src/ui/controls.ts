import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {BlockShape, Shape} from "../shape/shape";
import {Global} from "../entry";
import {enableHighlight, hitTestRectangle, makeTargetInteractive} from "../utils";
import {FlowHighlight, LogicHighlight} from "../shape/Highlight";
import {TVoid} from "../type/type";
import {ParameterInfo} from "./ParameterRenderer";
import {Parser} from "../parser/Parser";
import {Scope} from "../scope/scope";
import {LinearScope} from "../scope/LinearScope";
import {AttachInfo} from "../managers/AttachManager";
import {ParameterScope} from "../scope/ParameterScope";

export abstract class Control extends PIXI.Container {
    abstract get parser(): Parser;

    attachParent: AttachInfo | null = null;

    private _scope: Scope | null;
    flow: Control | null = null;
    flowHighlight: FlowHighlight;

    constructor(
        readonly shape: Shape
    ) {
        super();

        // UI Setup
        this.addChild(shape);

        Global.attachManager.registerFlow(this);

        this.flowHighlight = new FlowHighlight();
        this.addChild(this.flowHighlight);

        // event handling
        makeTargetInteractive(this);
        makeTargetInteractive(this.shape);
        enableHighlight(this.shape);

        this.on('mousedown', () => {
            if (!Global.dragging) {
                Global.setDragging(this);
                Global.attachManager.detachControl(this);
            }
        });

        this.on('mouseup', () => {
            if (Global.dragging == this) {
                Global.setDragging(null);

                if (hitTestRectangle(Global.menu, this)) {
                    this.destroy();
                } else {
                    Global.attachManager.removeHighlight();

                    let attachInfo = Global.attachManager.getNearestAttachPoint(
                        this.x, this.y,
                        this.attachFilter.bind(this)
                    );

                    if (attachInfo) {
                        Global.attachManager.attachControl(this, attachInfo);
                    }
                }
            }
        });
    }

    get scope() {
        return this._scope;
    }

    protected setScope(scope: Scope) {
        if (this._scope) {
            throw Error("Scope is already set!");
        }
        this._scope = scope;
        this.addChildAt(scope, 0);
        Global.attachManager.registerScope(this._scope);

        this.update();
    }

    // TODO: improve performance of finding scope root
    findScopeRoot(): Control {
        let now: Control = this;
        while (now.attachParent) {
            now = now.attachParent.attachTo;
        }

        return now;
    }

    update() {
        if (this.scope) {
            this.scope.drawScope();
        }
    }

    destroy() {
        this.parent.removeChild(this);

        Global.attachManager.deleteFlow(this);

        if (this.flow) {
            this.flow.destroy();
        }
        if (this.scope) {
            Global.attachManager.deleteScope(this.scope);
            this.scope.destroy();
        }
    }

    attachFilter(_attachInfo: AttachInfo): boolean {
        return false;
    }
}

export class Signal extends Control {
    constructor(readonly parser: Parser, shape: Shape) {
        super(shape);

        this.setScope(new LinearScope(this));

        Global.globalManager.registerGlobal(this);
    }

    destroy() {
        super.destroy();

        Global.globalManager.deleteGlobal(this);
    }
}

export class Block extends Control {
    logicChildren: Array<Block | null>;
    logicHighlights: LogicHighlight[];

    get numLogic(): number {
        return this.logicChildren.length;
    }

    constructor(
        readonly parser: Parser,
        readonly shape: BlockShape,
    ) {
        super(shape);

        // attach management
        this.logicHighlights = _.map(shape.highlightOffsets, (offset) => {
            let highlight = new LogicHighlight();
            this.addChild(highlight);
            highlight.x = offset.offsetX;
            highlight.y = offset.offsetY;
            return highlight;
        });

        this.logicChildren = _.times(shape.highlightOffsets.length, _.constant(null));

        Global.attachManager.registerLogic(this);
    }

    update() {
        this.shape.updateShape(this.logicChildren);
        Global.attachManager.updateLogic(this);

        // update child position
        for (let i = 0; i < this.numLogic; i++) {
            let offset = this.shape.highlightOffsets[i];
            let child = this.logicChildren[i];
            if (child) {
                child.x = offset.offsetX;
                child.y = offset.offsetY;
            }
        }

        if (this.scope) {
            this.scope.drawScope();
        }
    }

    destroy() {
        super.destroy();

        Global.attachManager.deleteLogic(this);

        for (let block of this.logicChildren) {
            if (block) {
                block.destroy();
            }
        }
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        if (attachInfo.attachType == "Logic") {
            return attachInfo.requiredType ? this.shape.returnType.fitsTo(attachInfo.requiredType) : true;
        } else {
            return true;
        }
    }
}

export class Declaration extends Block {
    private scopeInfoArr: ParameterInfo[];

    constructor(
        parser: Parser,
        shape: BlockShape
    ) {
        super(parser, shape);

        this.scopeInfoArr = [{
            returnType: new TVoid(),
            label: `local`,
        }];
        let scope = new ParameterScope(this, this.scopeInfoArr);
        this.setScope(scope);
    }

    update() {
        let logicChild = this.logicChildren[0];
        this.scopeInfoArr[0].returnType = logicChild ? logicChild.shape.returnType : new TVoid();

        super.update();
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        return attachInfo.attachType == "Scope";
    }
}

export class FlowItemFactory<F extends Control, L extends Parser, S extends Shape> {
    constructor(protected constructor: {new (logic: L, shape: S): F}, readonly logic: L, readonly shape: S) {
    }

    createFlowItem(): F {
        return new this.constructor(this.logic, this.shape.clone());
    }
}