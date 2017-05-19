import {drawEditPoint, drawLinear, initFlowGraphics, Scope} from "./scope";
import {Control} from "../ui/controls";
import {FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Global} from "../entry";

export class LinearScope extends Scope {
    constructor(control: Control) {
        super(control, 1);
    }

    drawScope(): Offset {
        initFlowGraphics(this.graphics);

        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(0, FLOW_VERTICAL_MARGIN);

        drawEditPoint(this.graphics, 0, FLOW_VERTICAL_MARGIN*.5);
        Global.attachManager.updateScope(this, 0, {
            offsetX: 0,
            offsetY: FLOW_VERTICAL_MARGIN*.5,
        });

        if (this.control.scope) {
            return drawLinear(this.graphics, 0, FLOW_VERTICAL_MARGIN, this.control.scope.scopeChildren[0], true);
        } else {
            return {
                offsetX: 0,
                offsetY: FLOW_VERTICAL_MARGIN,
            }
        }
    }
}