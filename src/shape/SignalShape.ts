import {Shape} from "./shape";
import {Offset} from "../controllers/AttachController";

const BEZIER_X = 6;
const BEZIER_Y = 25;

const SIGNAL_WIDTH = 140;
const SIGNAL_HEIGHT = 60;

const left = -SIGNAL_WIDTH*.5;
const top = -SIGNAL_HEIGHT;
const right = -left;
const bottom = top+SIGNAL_HEIGHT;

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

    readonly pivot: Offset = {
        offsetX: 0,
        offsetY: bottom,
    };

    readonly hitArea: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        right, top,
        right, bottom,
        left, bottom,
        left, top,
    );
}