import * as PIXI from "pixi.js";
import {Shape} from "./shape";
import {centerChild, createLabel} from "../utils";

const BEZIER_X = 5;
const BEZIER_Y = 18;

const WIDTH = 80;
const HEIGHT = 40;

const left = -WIDTH*.5;
const top = -HEIGHT;
const right = -left;
const bottom = top+HEIGHT;

export class SignalShape extends Shape {
    private graphics: PIXI.Graphics;

    clone() {
        return <this>new SignalShape(this.message);
    }

    constructor(private message: string) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.moveTo(left, top);
        this.graphics.bezierCurveTo(-BEZIER_X, top-BEZIER_Y, BEZIER_X, top+BEZIER_Y, right, top);
        this.graphics.lineTo(right, bottom);
        this.graphics.lineTo(left, bottom);
        this.graphics.lineTo(left, top);
        this.graphics.endFill();

        this.hitArea = new PIXI.Rectangle(left, top, WIDTH, HEIGHT);

        let text = createLabel(message);
        this.addChild(text);
        centerChild(text, 0, -HEIGHT*.5);
    }

}