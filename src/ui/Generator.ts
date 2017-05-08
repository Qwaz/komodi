import * as PIXI from "pixi.js";
import {Global} from "../entry";
import {FlowControl, FlowItemFactory} from "./flow";
import {Shape} from "../shape/shape";
import {Logic} from "../logic/logic";
import {enableHighlight, makeTargetInteractive} from "../utils";

export class Generator<F extends FlowControl, L extends Logic, S extends Shape> extends PIXI.Container {
    constructor(target: FlowItemFactory<F, L, S>) {
        super();

        let shape = target.shape.clone();
        this.addChild(shape);

        makeTargetInteractive(this);
        enableHighlight(this);

        this.on('mousedown', () => {
            let flowItem = target.createFlowItem();
            Global.stage.addChild(flowItem);
            Global.setDragging(flowItem, this.x, this.y);
        });
    }
}