import * as PIXI from "pixi.js";
import {Global} from "../entry";
import {Control} from "../controls";
import {Shape} from "../shape/shape";
import {Parser} from "../parser/parser";
import {enableHighlight, makeTargetInteractive} from "../utils";
import {ControlFactory} from "../factories/ControlFactory";

export class Generator<F extends Control, L extends Parser, S extends Shape> extends PIXI.Container {
    constructor(target: ControlFactory<F, L, S>) {
        super();

        let shape = target.shape.clone();
        this.addChild(shape);

        makeTargetInteractive(this);
        enableHighlight(this);

        this.on('mousedown', () => {
            let globalPosition = this.getGlobalPosition();

            let flowItem = target.createControl();
            Global.stage.addChild(flowItem);
            Global.setDragging(flowItem, globalPosition.x, globalPosition.y);
        });
    }
}