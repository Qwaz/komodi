import {HighlightInfo, StaticBlockShape} from "./StaticBlockShape";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./shape";
import * as _ from "lodash";

const RADIUS = 20;
const ANGLE = 50;
const STEP = 10;

const top = -2*RADIUS;

export class IfBlockShape extends StaticBlockShape {
    private static path: PIXI.Polygon = new (PIXI.Polygon.bind.apply(PIXI.Polygon,
        _.concat([
                0,
                -TRIANGLE_WIDTH*.5, top,
                0, top+TRIANGLE_HEIGHT,
                TRIANGLE_WIDTH*.5, top
            ],
            _(_.range(ANGLE, 360-ANGLE, STEP))
                .map((num) => num/180*Math.PI)
                .flatMap((num) => [RADIUS*Math.sin(num), -RADIUS-RADIUS*Math.cos(num)])
                .value(),
            [-TRIANGLE_WIDTH*.5, top]
        )
    ));

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
        super(color, IfBlockShape.path, IfBlockShape.highlightInfos);
    }
}