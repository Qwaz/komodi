import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {Offset} from "../controllers/AttachController";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const BUBBLE_WIDTH = 100;
const BUBBLE_HEIGHT = 60;

const left = -BUBBLE_WIDTH*.5;
const top = -BUBBLE_HEIGHT*.5;
const right = -left;
const bottom = -top;

export class UnitaryBlockShape extends StaticBlockShape {
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
        super(color, UnitaryBlockShape.path, UnitaryBlockShape.highlightInfos);
    }

    get pivot(): Offset {
        return {
            offsetX: 0,
            offsetY: bottom+TRIANGLE_HEIGHT,
        };
    }
}