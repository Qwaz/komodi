import * as PIXI from "pixi.js";
import {drawEditPoint} from "../controllers/flowStrategies";

export const TRIANGLE_WIDTH = 12;
export const TRIANGLE_HEIGHT = 9;

export class LogicHighlight extends PIXI.Graphics {
    constructor() {
        super();

        this.beginFill(0xFF0000, 0.7);
        this.drawShape(new PIXI.Polygon(
            0, 0,
            -TRIANGLE_WIDTH * .5, -TRIANGLE_HEIGHT,
            TRIANGLE_WIDTH * .5, -TRIANGLE_HEIGHT,
            0, 0,
        ));
        this.endFill();
    }
}

export class FlowHighlight extends PIXI.Graphics {
    constructor() {
        super();

        drawEditPoint(this, 0, 0, true);
    }
}