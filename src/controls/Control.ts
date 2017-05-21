import * as PIXI from "pixi.js";
import {Shape} from "../shape/shape";
import {Global} from "../entry";
import {enableHighlight, makeTargetInteractive} from "../utils";
import {FlowHighlight} from "../shape/Highlight";
import {Parser} from "../parser/Parser";
import {Scope} from "../scope/scope";
import {AttachInfo} from "../managers/AttachManager";

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

                let globalMouseX = Global.renderer.plugins.interaction.mouse.global.x;
                let globalMouseY = Global.renderer.plugins.interaction.mouse.global.y;

                let localMouse = Global.trashButton.toLocal(new PIXI.Point(
                    globalMouseX, globalMouseY
                ));

                debugger;
                if (Global.trashButton.hitArea.contains(localMouse.x, localMouse.y)) {
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

        // pixi destroy
        super.destroy();
    }

    attachFilter(_attachInfo: AttachInfo): boolean {
        return false;
    }
}
