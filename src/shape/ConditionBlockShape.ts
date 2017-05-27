import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {BlockShape} from "./shape";
import {TBoolean, TVoid, typeInfoToColor} from "../type/type";
import {centerChild, createLabel} from "../utils";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "../common";

const RADIUS = 20;
const ANGLE = 50;
const STEP = 10;

const top = -2*RADIUS;

export class ConditionBlockShape extends BlockShape {
    private graphics: PIXI.Graphics;

    readonly returnType = new TVoid();
    readonly highlightOffsets = [{offsetX: 0, offsetY: top+TRIANGLE_HEIGHT, requiredType: new TBoolean()}];

    clone() {
        return new ConditionBlockShape(this.msg);
    }

    constructor(readonly msg: string) {
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

        let text = createLabel(msg);
        this.addChild(text);
        centerChild(text, 0, -RADIUS);
    }
}