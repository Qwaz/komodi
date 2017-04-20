import * as PIXI from "pixi.js";
import {Offset} from "../controllers/AttachController";
import {Block} from "../ui/flow";

export type HitArea = PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle;

export abstract class Shape {
    abstract clone<T>(this: T): T;
    abstract get graphics(): PIXI.Graphics;
    abstract get hitArea(): HitArea;
}

export abstract class BlockShape extends Shape {
    abstract get highlightOffsets(): Offset[];

    abstract updateShape(logicChildren: Array<Block | null>): void;
}
