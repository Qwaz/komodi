import {BlockShape} from "./shape";
import {Offset} from "../controllers/AttachController";

export interface HighlightInfo extends Offset {
    path: PIXI.Polygon,
}

export abstract class StaticBlockShape extends BlockShape {
    readonly graphics: PIXI.Graphics;
    readonly highlightGraphics: PIXI.Graphics[] = [];
    readonly highlightOffsets: Offset[] = [];

    constructor(color: number, readonly hitArea: PIXI.Polygon, highlightInfos: HighlightInfo[]) {
        super();

        this.graphics = new PIXI.Graphics();

        this.graphics.lineStyle(1, 0x000000, 1);
        this.graphics.beginFill(color);
        this.graphics.drawPolygon(hitArea.points);
        this.graphics.endFill();

        for (let highlightInfo of highlightInfos) {
            let highlight = new PIXI.Graphics();
            highlight.beginFill(0xFF0000, 0.5);
            highlight.drawPolygon(highlightInfo.path.points);
            highlight.endFill();
            this.highlightGraphics.push(highlight);
            this.highlightOffsets.push(highlightInfo);
        }

        this.hitArea = hitArea;
    }
}