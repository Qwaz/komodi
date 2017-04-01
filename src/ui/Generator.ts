import {Global} from "../entry";
import {FlowItem, FlowItemFactory} from "./flow";

export class Generator<T extends FlowItem> extends PIXI.Container {
    constructor(target: FlowItemFactory<T>) {
        super();

        this.addChild(target.shape.graphics.clone());

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = target.shape.hitArea;

        this.on('mouseover', () => this.alpha = 0.7);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            let flowItem = target.createFlowItem();
            Global.stage.addChild(flowItem);
            Global.dragging = flowItem;
        });
    }
}