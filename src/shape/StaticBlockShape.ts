import {BlockShape} from "./shape";
import {Offset} from "../controllers/AttachController";

export interface HighlightInfo extends Offset {
    path: PIXI.Polygon,
}

export abstract class StaticBlockShape extends BlockShape {
    private _graphics: PIXI.Graphics;
    private _highlightGraphics: PIXI.Graphics[] = [];
    private _highlightOffsets: Offset[] = [];

    constructor(color: number, private path: PIXI.Polygon, highlightInfos: HighlightInfo[]) {
        super();

        this._graphics = new PIXI.Graphics();

        this._graphics.lineStyle(1, 0x000000, 1);
        this._graphics.beginFill(color);
        this._graphics.drawPolygon(this.path.points);
        this._graphics.endFill();

        for (let highlightInfo of highlightInfos) {
            let highlight = new PIXI.Graphics();
            highlight.beginFill(0xFF0000, 0.5);
            highlight.drawPolygon(highlightInfo.path.points);
            highlight.endFill();
            this._highlightGraphics.push(highlight);
            this._highlightOffsets.push(highlightInfo);
        }
    }

    get graphics() {
        return this._graphics;
    }

    get highlightGraphics() {
        return this._highlightGraphics;
    }

    get highlightOffsets() {
        return this._highlightOffsets;
    }

    get hitArea() {
        return this.path;
    }
}