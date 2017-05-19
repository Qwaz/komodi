import * as PIXI from "pixi.js";
import {Global} from "../entry";
import {Control, FlowItemFactory} from "./controls";
import {Shape} from "../shape/shape";
import {Parser} from "../parser/parser";
import {enableHighlight, makeTargetInteractive} from "../utils";

export class Generator<F extends Control, L extends Parser, S extends Shape> extends PIXI.Container {
    constructor(target: FlowItemFactory<F, L, S>) {
        super();

        let shape = target.shape.clone();
        this.addChild(shape);

        makeTargetInteractive(this);
        enableHighlight(this);

        this.on('mousedown', () => {
            let globalPosition = this.getGlobalPosition();

            let flowItem = target.createFlowItem();
            Global.stage.addChild(flowItem);
            Global.setDragging(flowItem, globalPosition.x, globalPosition.y);
        });
    }
}