import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 35;

const left = -BLOCK_WIDTH*.5;
const top = -TRIANGLE_HEIGHT-BLOCK_HEIGHT;
const right = -left;
const bottom = top+BLOCK_HEIGHT;

export class SmallBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        right, top,
        right, bottom,
        TRIANGLE_WIDTH*.5, bottom,
        0, bottom+TRIANGLE_HEIGHT,
        -TRIANGLE_WIDTH*.5, bottom,
        left, bottom,
        left, top,
    );

    private static highlightInfos: HighlightInfo[] = [];

    constructor(color: number) {
        super(color, SmallBlockShape.path, SmallBlockShape.highlightInfos);
    }
}