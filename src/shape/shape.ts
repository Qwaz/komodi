import * as PIXI from "pixi.js";
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
    abstract updateShape(logicChildren: Array<Block | null>): void;
}

export function createLabel(text: string): PIXI.Text {
    return new PIXI.Text(text, {
        fontSize: 14, align : 'center'
    })
}