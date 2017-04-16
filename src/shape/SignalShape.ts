import {HitArea, Shape} from "./shape";

const BEZIER_X = 6;
const BEZIER_Y = 18;

const WIDTH = 100;
const HEIGHT = 50;

const left = -WIDTH*.5;
const top = -HEIGHT;
const right = -left;
const bottom = top+HEIGHT;

export class SignalShape extends Shape {
    readonly graphics: PIXI.Graphics;

    constructor() {
        super();

        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(0xFFFFFF);
        this.graphics.moveTo(left, top);
        this.graphics.bezierCurveTo(-BEZIER_X, top-BEZIER_Y, BEZIER_X, top+BEZIER_Y, right, top);
        this.graphics.lineTo(right, bottom);
        this.graphics.lineTo(left, bottom);
        this.graphics.lineTo(left, top);
        this.graphics.endFill();
    }

    readonly hitArea: HitArea = new PIXI.Rectangle(left, top, WIDTH, HEIGHT);
}