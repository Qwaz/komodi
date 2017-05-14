import * as PIXI from "pixi.js";
import {BlockShape, createLabel} from "./shape";
import {centerChild} from "../utils";
import {TVoid, TypeInfo} from "../type/type";
import {TypedOffset} from "../controllers/AttachController";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./Highlight";

const LINE = 4;
const GAP = 4;
const WIDTH = 70;
const HEIGHT = 30;

const left = -WIDTH*.5;
const right = -left;
const top = -HEIGHT-LINE-GAP;
const bottom = top+HEIGHT;

export class DeclarationShape extends BlockShape {
    private graphics: PIXI.Graphics;

    private returnVoid: TypeInfo = new TVoid();
    private _highlightOffsets: TypedOffset[] = [{
        offsetX: 0,
        offsetY: top+TRIANGLE_HEIGHT,
    }];

    clone() {
        return new DeclarationShape(this.color);
    }

    constructor(private color: number) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(left, bottom+GAP, WIDTH, LINE);
        this.graphics.drawPolygon([
            left, top,
            -TRIANGLE_WIDTH*.5, top,
            0, top+TRIANGLE_HEIGHT,
            TRIANGLE_WIDTH*.5, top,
            right, top,
            right, bottom,
            left, bottom,
            left, top,
        ]);

        this.hitArea = new PIXI.Rectangle(left, top, WIDTH, HEIGHT);

        let text = createLabel("let");
        this.addChild(text);
        centerChild(text, 0, -HEIGHT*.5-LINE-GAP);
    }

    get returnType(): TypeInfo {
        return this.returnVoid;
    }

    get highlightOffsets(): TypedOffset[] {
        return this._highlightOffsets;
    }
}