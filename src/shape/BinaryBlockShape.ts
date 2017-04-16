import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";

const CENTER_MARGIN = 60;
const OUT_MARGIN = 20;

const BLOCK_HEIGHT = 50;

const left = -OUT_MARGIN-TRIANGLE_WIDTH-CENTER_MARGIN*.5;
const top = -TRIANGLE_HEIGHT-BLOCK_HEIGHT;
const right = -left;
const bottom = top+BLOCK_HEIGHT;

export class BinaryBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        left+OUT_MARGIN, top,
        left+OUT_MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        left+OUT_MARGIN+TRIANGLE_WIDTH, top,
        right-OUT_MARGIN-TRIANGLE_WIDTH, top,
        right-OUT_MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
        right-OUT_MARGIN, top,
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
                    left+OUT_MARGIN, top,
                    left+OUT_MARGIN+TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                    left+OUT_MARGIN+TRIANGLE_WIDTH, top,
                    left+OUT_MARGIN, top,
                ),
            offsetX: left+OUT_MARGIN+TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
        {
            path: new PIXI.Polygon(
                right-OUT_MARGIN-TRIANGLE_WIDTH, top,
                right-OUT_MARGIN-TRIANGLE_WIDTH*.5, top+TRIANGLE_HEIGHT,
                right-OUT_MARGIN, top,
                right-OUT_MARGIN-TRIANGLE_WIDTH, top,
            ),
            offsetX: right-OUT_MARGIN-TRIANGLE_WIDTH*.5,
            offsetY: top+TRIANGLE_HEIGHT,
        },
    ];

    constructor(color: number) {
        super(color, BinaryBlockShape.path, BinaryBlockShape.highlightInfos);
    }
}