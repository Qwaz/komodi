import * as PIXI from "pixi.js";
import {Shape} from "../shape/shape";
import {Komodi} from "../Global";
import {enableHighlight, getMousePoint, makeTargetInteractive} from "../utils";
import {FlowHighlight} from "../shape/Highlight";
import {Scope} from "../scope/scope";
import {AttachInfo} from "../managers/AttachManager";
import {Parser} from "../parser";

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

        Komodi.attachManager.registerFlow(this);

        this.flowHighlight = new FlowHighlight();
        this.addChild(this.flowHighlight);

        // event handling
        makeTargetInteractive(this);
        makeTargetInteractive(this.shape);
        enableHighlight(this.shape);

        this.on('mousedown', () => {
            if (!Komodi.dragging) {
                Komodi.setDragging(this);
                Komodi.attachManager.detachControl(this);
            }
        });

        this.on('mouseup', () => {
            if (Komodi.dragging == this) {
                Control.mouseupHandler(this);
            }
        });
    }

    static mouseupHandler(target: Control) {
        Komodi.setDragging(null);

        let localMouse = Komodi.trashButton.toLocal(getMousePoint());
        if (Komodi.trashButton.hitArea.contains(localMouse.x, localMouse.y)) {
            target.destroy();
        } else {
            Komodi.attachManager.removeHighlight();

            let attachInfo = Komodi.attachManager.getNearestAttachPoint(
                target.x, target.y,
                target.attachFilter.bind(target)
            );

            if (attachInfo) {
                Komodi.attachManager.attachControl(target, attachInfo);
            }
        }
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
        Komodi.attachManager.registerScope(this._scope);

        this.update();
    }

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

        Komodi.attachManager.deleteFlow(this);

        if (this.flow) {
            this.flow.destroy();
        }
        if (this.scope) {
            Komodi.attachManager.deleteScope(this.scope);
            this.scope.destroy();
        }

        // pixi destroy
        super.destroy();
    }

    attachFilter(_attachInfo: AttachInfo): boolean {
        return false;
    }
}
