import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {Offset} from "../controllers/AttachController";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const BUBBLE_MARGIN = 30;
const BUBBLE_HEIGHT = 70;

const left = -BUBBLE_MARGIN-TRIANGLE_WIDTH-50;
const top = -BUBBLE_HEIGHT*.5;
const right = -left;
const bottom = -top;

export class BinaryBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        left+BUBBLE_MARGIN, top,
        left+BUBBLE_MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        left+BUBBLE_MARGIN+TRIANGLE_WIDTH, top,
        right-BUBBLE_MARGIN-TRIANGLE_WIDTH, top,
        right-BUBBLE_MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        right-BUBBLE_MARGIN, top,
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
                    left+BUBBLE_MARGIN, top,
                    left+BUBBLE_MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                    left+BUBBLE_MARGIN+TRIANGLE_WIDTH, top,
                    left+BUBBLE_MARGIN, top,
                ),
            offsetX: left+BUBBLE_MARGIN+TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
        {
            path: new PIXI.Polygon(
                right-BUBBLE_MARGIN-TRIANGLE_WIDTH, top,
                right-BUBBLE_MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                right-BUBBLE_MARGIN, top,
                right-BUBBLE_MARGIN-TRIANGLE_WIDTH, top,
            ),
            offsetX: right-BUBBLE_MARGIN-TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
    ];

    constructor(color: number) {
        super(color, BinaryBlockShape.path, BinaryBlockShape.highlightInfos);
    }

    get pivot(): Offset {
        return {
            offsetX: 0,
            offsetY: bottom+TRIANGLE_HEIGHT,
        };
    }
}