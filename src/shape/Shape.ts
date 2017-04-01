import {Offset} from "../controllers/AttachController";

abstract class Shape {
    abstract get graphics(): PIXI.Graphics;
    abstract get pivot(): Offset;
    abstract get highlightGraphics(): PIXI.Graphics[];
    abstract get highlightOffsets(): Offset[];
    abstract get hitArea(): PIXI.Polygon;
}

export default Shape;