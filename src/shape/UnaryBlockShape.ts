import * as PIXI from "pixi.js";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 60;

const left = -BLOCK_WIDTH*.5;
const top = -TRIANGLE_HEIGHT-BLOCK_HEIGHT;
const right = -left;
const bottom = top+BLOCK_HEIGHT;

export class UnaryBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        -TRIANGLE_WIDTH*.5, top,
        0, top+TRIANGLE_HEIGHT,
        TRIANGLE_WIDTH*.5, top,
        right, top,
        right, bottom,
        TRIANGLE_WIDTH*.5, bottom,
        0, bottom+TRIANGLE_HEIGHT,
        -TRIANGLE_WIDTH*.5, bottom,
        left, bottom,
        left, top,
    );

    private static highlightInfos: HighlightInfo[] = [
        {
            path: new PIXI.Polygon(
                -TRIANGLE_WIDTH*.5, top,
                0, top+TRIANGLE_HEIGHT,
                TRIANGLE_WIDTH*.5, top,
                -TRIANGLE_WIDTH*.5, top,
            ),
            offsetX: 0,
            offsetY: top+TRIANGLE_HEIGHT,
        },
    ];

    constructor(color: number) {
        super(color, UnaryBlockShape.path, UnaryBlockShape.highlightInfos);
    }
}