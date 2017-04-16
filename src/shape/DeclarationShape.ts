import * as PIXI from "pixi.js";
import {HitArea, Shape} from "./shape";

const LINE = 4;
const GAP = 4;
const WIDTH = 70;
const HEIGHT = 30;

const left = -WIDTH*.5;
const top = -HEIGHT-LINE-GAP;
const bottom = top+HEIGHT;

export class DeclarationShape extends Shape {
    readonly graphics: PIXI.Graphics;

    constructor(color: number) {
        super();

        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(left, top, WIDTH, HEIGHT);
        this.graphics.drawRect(left, bottom+GAP, WIDTH, LINE);
    }

    readonly hitArea: HitArea = new PIXI.Rectangle(left, top, WIDTH, HEIGHT);
}