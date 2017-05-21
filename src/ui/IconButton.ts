import {centerChild, makeTargetInteractive} from "../utils";

const FONT_SIZE = 38;
const RADIUS = 34;

export const Icons = {
    HTML5: '\uf13b',
    TRASH: '\uf1f8',
    PLAY: '\uf04b',
    PLAY_CIRCLE_O: '\uf01d',
};

export class IconButton extends PIXI.Container {
    private text: PIXI.Text;
    private background: PIXI.Graphics;

    constructor(msg: string, color: number=0xFFFFFF) {
        super();

        this.text = new PIXI.Text(msg, {
            fontSize: FONT_SIZE, align : 'center', fontFamily: 'FontAwesome', fill: 0xffffff
        });

        this.background = new PIXI.Graphics();
        this.background.lineStyle(1);
        this.background.beginFill(color);
        this.background.drawCircle(0, 0, RADIUS);
        this.hitArea = new PIXI.Circle(0, 0, RADIUS);

        this.addChild(this.background);
        this.addChild(this.text);

        centerChild(this.text, 0, 0);

        makeTargetInteractive(this);
    }
}