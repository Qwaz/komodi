import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const MARGIN = 30;

const BLOCK_HEIGHT = 70;

const left = -MARGIN-TRIANGLE_WIDTH-50;
const top = -TRIANGLE_HEIGHT-BLOCK_HEIGHT;
const right = -left;
const bottom = top+BLOCK_HEIGHT;

export class BinaryBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        left+MARGIN, top,
        left+MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        left+MARGIN+TRIANGLE_WIDTH, top,
        right-MARGIN-TRIANGLE_WIDTH, top,
        right-MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        right-MARGIN, top,
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
                    left+MARGIN, top,
                    left+MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                    left+MARGIN+TRIANGLE_WIDTH, top,
                    left+MARGIN, top,
                ),
            offsetX: left+MARGIN+TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
        {
            path: new PIXI.Polygon(
                right-MARGIN-TRIANGLE_WIDTH, top,
                right-MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                right-MARGIN, top,
                right-MARGIN-TRIANGLE_WIDTH, top,
            ),
            offsetX: right-MARGIN-TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
    ];

    constructor(color: number) {
        super(color, BinaryBlockShape.path, BinaryBlockShape.highlightInfos);
    }
}