import {Offset} from "../controllers/AttachController";

export abstract class Shape {
    abstract get graphics(): PIXI.Graphics;
    abstract get hitArea(): PIXI.Polygon;
}

export abstract class BlockShape extends Shape {
    abstract get highlightGraphics(): PIXI.Graphics[];
    abstract get highlightOffsets(): Offset[];
}

export const TRIANGLE_WIDTH = 20;
export const TRIANGLE_HEIGHT = 15;