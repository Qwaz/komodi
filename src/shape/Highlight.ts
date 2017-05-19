import * as PIXI from "pixi.js";
import {EDIT_POINT_RADIUS, TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "../common";

function initHighlightGraphics(graphics: PIXI.Graphics) {
    graphics.beginFill(0xFF0000, 0.7);
}

function drawHighlight(graphics: PIXI.Graphics, x: number, y: number) {
    initHighlightGraphics(graphics);
    graphics.drawCircle(x, y, EDIT_POINT_RADIUS);
    graphics.endFill();
}

export class LogicHighlight extends PIXI.Graphics {
    constructor() {
        super();

        initHighlightGraphics(this);
        this.drawShape(new PIXI.Polygon(
            0, 0,
            -TRIANGLE_WIDTH * .5, -TRIANGLE_HEIGHT,
            TRIANGLE_WIDTH * .5, -TRIANGLE_HEIGHT,
            0, 0,
        ));
        this.endFill();

        this.visible = false;
    }
}

export class FlowHighlight extends PIXI.Graphics {
    constructor() {
        super();

        drawHighlight(this, 0, 0);

        this.visible = false;
    }
}