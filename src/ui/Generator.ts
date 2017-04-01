import {Global} from "../entry";
import {FlowItem, FlowItemFactory} from "./flow";
import {Shape} from "../shape/shape";

export class Generator<T extends FlowItem, S extends Shape> extends PIXI.Container {
    constructor(target: FlowItemFactory<T, S>) {
        super();

        this.addChild(target.shape.graphics.clone());

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = target.shape.hitArea;

        this.on('mouseover', () => this.alpha = 0.85);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            let flowItem = target.createFlowItem();
            Global.stage.addChild(flowItem);
            Global.dragging = flowItem;
        });
    }
}