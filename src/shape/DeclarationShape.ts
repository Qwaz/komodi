import * as PIXI from "pixi.js";
import {BlockShape} from "./shape";
import {centerChild, createLabel} from "../utils";
import {TVoid, TypeInfo} from "../type";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH, TypedOffset} from "../common";

const LINE = 4;
const GAP = 4;
const PAD_HORIZONTAL = 12;
const HEIGHT = 33;

const top = -HEIGHT-LINE*.5-GAP;
const bottom = top+HEIGHT;

export class DeclarationShape extends BlockShape {
    private graphics: PIXI.Graphics;

    private returnVoid: TypeInfo = new TVoid();
    private _highlightOffsets: TypedOffset[] = [{
        offsetX: 0,
        offsetY: top+TRIANGLE_HEIGHT,
    }];

    clone() {
        return new DeclarationShape(this.color, this.variableName);
    }

    constructor(private color: number, readonly variableName: string) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        let text = createLabel(`let ${variableName} =`);
        this.addChild(text);
        centerChild(text, 0, -HEIGHT*.5-LINE*.5-GAP);

        const left = -text.width*.5 - PAD_HORIZONTAL;
        const right = text.width*.5 + PAD_HORIZONTAL;

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawRect(left, bottom+GAP, right-left, LINE);
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

        this.hitArea = new PIXI.Rectangle(left, top, right-left, HEIGHT);
    }

    get returnType(): TypeInfo {
        return this.returnVoid;
    }

    get highlightOffsets(): TypedOffset[] {
        return this._highlightOffsets;
    }
}