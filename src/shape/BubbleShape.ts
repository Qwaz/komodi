import Shape from "./Shape";
import {Offset} from "../controllers/AttachController";

const BUBBLE_WIDTH = 100;
const BUBBLE_HEIGHT = 60;
const TRIANGLE_WIDTH = 20;
const TRIANGLE_HEIGHT = 15;

const left = -BUBBLE_WIDTH*.5;
const top = -BUBBLE_HEIGHT*.5;
const right = -left;
const bottom = -top;

export default class BubbleShape extends Shape {
    private static path: PIXI.Polygon = new PIXI.Polygon(
        left, top,
        -TRIANGLE_WIDTH*.5, top,
        0, top+TRIANGLE_HEIGHT,
        TRIANGLE_WIDTH*.5, top,
        right, top,
        right, bottom,
        TRIANGLE_WIDTH*.5, bottom,
        0, bottom+TRIANGLE_HEIGHT,
        -TRIANGLE_WIDTH*.5, bottom,
        left, bottom,
        left, top,
    );

    private static highlightPaths: PIXI.Polygon[] = [
        new PIXI.Polygon(
            -TRIANGLE_WIDTH*.5, top,
            0, top+TRIANGLE_HEIGHT,
            TRIANGLE_WIDTH*.5, top,
            -TRIANGLE_WIDTH*.5, top,
        ),
    ];

    private _graphics: PIXI.Graphics;
    private _highlightGraphics: PIXI.Graphics[] = [];

    constructor(color: number) {
        super();

        this._graphics = new PIXI.Graphics();

        this._graphics.lineStyle(1, 0x000000, 1);
        this._graphics.beginFill(color);
        this._graphics.drawPolygon(BubbleShape.path.points);
        this._graphics.endFill();

        for (let path of BubbleShape.highlightPaths) {
            let highlight = new PIXI.Graphics();
            highlight.beginFill(0xFF0000, 0.5);
            highlight.drawPolygon(path.points);
            highlight.endFill();
            this._highlightGraphics.push(highlight);
        }
    }

    get graphics() {
        return this._graphics;
    }

    get pivot(): Offset {
        return {
            offsetX: 0,
            offsetY: bottom+TRIANGLE_HEIGHT,
        };
    }

    get highlightGraphics() {
        return this._highlightGraphics;
    }
    get highlightOffsets(): Offset[] {
        return [
            {
                offsetX: 0,
                offsetY: top+TRIANGLE_HEIGHT,
            },
        ];
    }

    get hitArea() {
        return BubbleShape.path;
    }
}