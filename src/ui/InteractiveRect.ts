import * as PIXI from "pixi.js";

export class InteractiveRect extends PIXI.Container {
    private graphics: PIXI.Graphics;

    constructor(private color: number) {
        super();

        this.interactive = true;

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    }

    updateRegion(rect: PIXI.Rectangle) {
        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.drawShape(rect);
        this.graphics.endFill();

        this.hitArea = rect;
    }
}