import * as PIXI from "pixi.js";
import {Global} from "../entry";
import {Control} from "../controls";
import {Shape} from "../shape/shape";
import {enableHighlight, makeTargetInteractive, stagePositionOf} from "../utils";
import {Parser} from "../parser/Parser";
import {SimpleFactory} from "../factories/SimpleFactory";

export class SimpleGenerator<F extends Control, P extends Parser, S extends Shape> extends PIXI.Container {
    constructor(target: SimpleFactory<F, P, S>) {
        super();

        let shape = target.shape.clone();
        this.addChild(shape);

        makeTargetInteractive(this);
        enableHighlight(this);

        this.on('mousedown', () => {
            let stagePosition = stagePositionOf(this);

            let flowItem = target.createControl();
            Global.stage.addChild(flowItem);
            Global.setDragging(flowItem, stagePosition.x, stagePosition.y);
        });
    }
}