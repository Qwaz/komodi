import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {TypedOffset} from "../controllers/AttachController";
import {Block} from "../ui/flow";
import {TypeInfo} from "../type/type";

export type HitArea = PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle;

export abstract class Shape extends PIXI.Container {
    abstract clone<T>(this: T): T;
}

export abstract class BlockShape extends Shape {
    abstract get returnType(): TypeInfo;
    abstract get highlightOffsets(): TypedOffset[];

    updateShape(logicChildren: Array<Block | null>): void {
        _(logicChildren).forEach((block) => {
            if (block) {
                block.updateControl();
            }
        })
    };
}

export function createLabel(text: string): PIXI.Text {
    return new PIXI.Text(text, {
        fontSize: 14, align : 'center'
    })
}