import * as PIXI from "pixi.js";
import {createLabel, Shape} from "./shape";
import {centerChild} from "../utils";

const LINE = 4;
const GAP = 4;
const WIDTH = 70;
const HEIGHT = 30;

const left = -WIDTH*.5;
const top = -HEIGHT-LINE-GAP;
const bottom = top+HEIGHT;

export class DeclarationShape extends Shape {
    private graphics: PIXI.Graphics;

    clone() {
        return new DeclarationShape(this.color);
    }

    constructor(private color: number) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(left, top, WIDTH, HEIGHT);
        this.graphics.drawRect(left, bottom+GAP, WIDTH, LINE);

        this.hitArea = new PIXI.Rectangle(left, top, WIDTH, HEIGHT);

        let text = createLabel("let");
        this.addChild(text);
        centerChild(text, 0, -HEIGHT*.5-LINE-GAP);
    }
}