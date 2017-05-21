import {Control} from "../controls";
import {drawEditPoint, drawLinear, initFlowGraphics, Scope} from "./scope";
import {FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Global} from "../entry";

const LOOP_HORIZONTAL_PADDING = 10;
const LOOP_TRIANGLE_WIDTH = 6;
const LOOP_TRIANGLE_HEIGHT = 5;

export class LoopScope extends Scope {
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

        let offset = drawLinear(this.graphics, 0, FLOW_VERTICAL_MARGIN, this.scopeChildren[0], true);

        let bounds = this.control.getLocalBounds();
        bounds.height -= LOOP_TRIANGLE_HEIGHT*.5 + 1;

        let endX, endY;
        this.graphics.lineStyle(2, 0x616161);
        this.graphics.beginFill(0x616161);

        // draw left side
        const left = bounds.left - LOOP_HORIZONTAL_PADDING;
        this.graphics.moveTo(left + bounds.width*.15, 0);
        this.graphics.lineTo(left, 0);
        this.graphics.moveTo(left, 0);
        this.graphics.lineTo(left, bounds.bottom);
        this.graphics.moveTo(left, bounds.bottom);
        this.graphics.lineTo(left + bounds.width*.35, bounds.bottom);

        endX = left + bounds.width*.35;
        endY = bounds.bottom;
        this.graphics.drawPolygon([
            endX, endY,
            endX-LOOP_TRIANGLE_WIDTH, endY-LOOP_TRIANGLE_HEIGHT*.5,
            endX-LOOP_TRIANGLE_WIDTH, endY+LOOP_TRIANGLE_HEIGHT*.5,
            endX, endY,
        ]);

        // draw right side
        const right = bounds.right + LOOP_HORIZONTAL_PADDING;
        this.graphics.moveTo(right - bounds.width*.15, bounds.bottom);
        this.graphics.lineTo(right, bounds.bottom);
        this.graphics.moveTo(right, bounds.bottom);
        this.graphics.lineTo(right, 0);
        this.graphics.moveTo(right, 0);
        this.graphics.lineTo(right - bounds.width*.35, 0);

        endX = right - bounds.width*.35;
        endY = 0;
        this.graphics.drawPolygon([
            endX, endY,
            endX+LOOP_TRIANGLE_WIDTH, endY-LOOP_TRIANGLE_HEIGHT*.5,
            endX+LOOP_TRIANGLE_WIDTH, endY+LOOP_TRIANGLE_HEIGHT*.5,
            endX, endY,
        ]);

        return {
            offsetX: offset.offsetX,
            offsetY: offset.offsetY,
        };
    }
}