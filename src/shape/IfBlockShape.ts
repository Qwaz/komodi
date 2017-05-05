import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {BlockShape, createLabel} from "./shape";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./Highlight";
import {TBoolean, TVoid, typeInfoToColor} from "../type/type";
import {centerChild} from "../utils";

const RADIUS = 20;
const ANGLE = 50;
const STEP = 10;

const top = -2*RADIUS;

export class IfBlockShape extends BlockShape {
    private graphics: PIXI.Graphics;

    readonly returnType = new TVoid();
    readonly highlightOffsets = [{offsetX: 0, offsetY: top+TRIANGLE_HEIGHT, requiredType: new TBoolean()}];

    clone() {
        return new IfBlockShape();
    }

    constructor() {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.hitArea = new (PIXI.Polygon.bind.apply(PIXI.Polygon,
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

        this.graphics.lineStyle(1, 0x000000);
        this.graphics.beginFill(typeInfoToColor(new TBoolean()));
        this.graphics.drawShape(this.hitArea);
        this.graphics.endFill();

        let text = createLabel('if');
        this.addChild(text);
        centerChild(text, 0, -RADIUS);
    }
}