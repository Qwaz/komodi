import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {Offset} from "../controllers/AttachController";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const BUBBLE_WIDTH = 50;
const BUBBLE_HEIGHT = 45;

const left = -BUBBLE_WIDTH*.5;
const top = -BUBBLE_HEIGHT*.5;
const right = -left;
const bottom = -top;

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

    get pivot(): Offset {
        return {
            offsetX: 0,
            offsetY: bottom+TRIANGLE_HEIGHT,
        };
    }
}