import {drawEditPoint, drawLinear, initFlowGraphics, Scope} from "./scope";
import {Control} from "../controls";
import {ParameterInfo, ParameterRenderer} from "../ui/ParameterRenderer";
import {FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Komodi} from "../Global";

const OUTLINE_PADDING = 6;
const GENERATOR_VERTICAL_PADDING = 6;

export class ParameterScope extends Scope {
    private parameterRenderer: ParameterRenderer;

    constructor(control: Control, private parameterInfoArr: ParameterInfo[]) {
        super(control, 1);

        this.parameterRenderer = new ParameterRenderer(control);
    }

    drawScope(): Offset {
        this.parameterRenderer.update(this.parameterInfoArr);
        this.control.addChild(this.parameterRenderer);

        initFlowGraphics(this.graphics);
        let startY = this.parameterRenderer.height + GENERATOR_VERTICAL_PADDING*2;
        this.parameterRenderer.y = startY / 2;

        this.graphics.moveTo(0, startY);
        this.graphics.lineTo(0, startY+FLOW_VERTICAL_MARGIN);

        drawEditPoint(this.graphics, 0, startY+FLOW_VERTICAL_MARGIN*.5);
        Komodi.attachManager.updateScope(this, 0, {
            offsetX: 0,
            offsetY: startY+FLOW_VERTICAL_MARGIN*.5,
        });

        let offset = drawLinear(this.graphics, 0, startY+FLOW_VERTICAL_MARGIN, this.scopeChildren[0], true);

        let bounds = this.control.getLocalBounds();

        // draw parameterRenderer background
        this.graphics.lineStyle();
        this.graphics.beginFill(0xCFD8DC, 0.8);
        this.graphics.drawRect(
            bounds.x - OUTLINE_PADDING, 0,
            bounds.width + OUTLINE_PADDING*2, startY
        );
        this.graphics.endFill();

        // draw outline
        this.graphics.lineStyle(1, 0x9E9E9E);
        this.graphics.drawRect(
            bounds.x - OUTLINE_PADDING, 0,
            bounds.width + OUTLINE_PADDING*2, bounds.bottom
        );

        return offset;
    }

    destroy() {
        this.parameterRenderer.destroy();

        super.destroy();
    }
}