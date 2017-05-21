import {enableHighlight, makeTargetInteractive} from "../utils";

const TEXT_PADDING = 14;

export class TextButton extends PIXI.Container {
    private text: PIXI.Text;
    private background: PIXI.Graphics;

    constructor(msg: string, color: number=0xFFFFFF) {
        super();

        this.text = new PIXI.Text(msg);
        this.text.x = TEXT_PADDING;
        this.text.y = TEXT_PADDING;

        let backgroundWidth = this.text.width + TEXT_PADDING*2;
        let backgroundHeight = this.text.height + TEXT_PADDING*2;

        this.background = new PIXI.Graphics();
        this.background.lineStyle(1);
        this.background.beginFill(color);
        this.background.drawRect(0, 0, backgroundWidth, backgroundHeight);
        this.hitArea = new PIXI.Rectangle(0, 0, backgroundWidth, backgroundHeight);

        this.addChild(this.background);
        this.addChild(this.text);

        makeTargetInteractive(this);
        enableHighlight(this);
    }
}