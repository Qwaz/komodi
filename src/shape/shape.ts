import {Offset} from "../controllers/AttachController";

export type HitArea = PIXI.Rectangle | PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.RoundedRectangle;

export abstract class Shape {
    abstract get graphics(): PIXI.Graphics;
    abstract get hitArea(): HitArea;
}

export abstract class BlockShape extends Shape {
    abstract get highlightGraphics(): PIXI.Graphics[];
    abstract get highlightOffsets(): Offset[];
}

export const TRIANGLE_WIDTH = 12;
export const TRIANGLE_HEIGHT = 9;