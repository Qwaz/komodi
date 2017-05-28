import * as PIXI from "pixi.js";

export class InteractiveRect extends PIXI.Container {
    readonly graphics: PIXI.Graphics;
    private rect: PIXI.Rectangle;

    constructor(private color: number) {
        super();

        this.interactive = true;

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.rect = new PIXI.Rectangle();
    }

    updateRegion(rect: PIXI.Rectangle) {
        this.rect = rect;

        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.drawShape(rect);
        this.graphics.endFill();

        this.hitArea = rect;
    }

    updateWidth(width: number) {
        this.rect.width = width;
        this.updateRegion(this.rect);
    }

    updateHeight(height: number) {
        this.rect.height = height;
        this.updateRegion(this.rect);
    }
}