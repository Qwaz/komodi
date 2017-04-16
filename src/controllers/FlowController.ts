import * as PIXI from "pixi.js";
import {FlowControl} from "../ui/flow";

export class Flow extends PIXI.Container {
    private graphics: PIXI.Graphics;

    constructor(private flowStart: FlowControl) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
        flowStart.addChild(this);

        this.update();
    }

    update() {
        this.graphics.clear();
        this.flowStart.flowStrategy(this.graphics, this.flowStart);
    }
}

export class FlowController {
    private controls: Map<FlowControl, Flow> = new Map<FlowControl, Flow>();

    registerControl(control: FlowControl) {
        this.controls.set(control, new Flow(control));
    }

    deleteControl(control: FlowControl) {
        this.controls.delete(control);
    }

    update(control: FlowControl) {
        let flow = this.controls.get(control);
        if (flow) {
            flow.update();
        }
    }
}