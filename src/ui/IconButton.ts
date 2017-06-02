import {centerChild, makeTargetInteractive} from "../utils";

export const Icons = {
    HTML5: '\uf13b',
    TRASH: '\uf1f8',
    PLAY: '\uf04b',
    PLAY_CIRCLE_O: '\uf01d',
    PAUSE: '\uf04c',
    WRENCH: '\uf0ad',
};

export interface IconButtonSetting {
    radius?: number,
    fontSize?: number,
    fontColor?: number,
    color?: number,
}

const DEFAULT_RADIUS = 20;
const DEFAULT_FONT_SIZE = 22;
const DEFAULT_FONT_COLOR = 0x000000;
const DEFAULT_COLOR = 0xFFFFFF;

export class IconButton extends PIXI.Container {
    private text: PIXI.Text;
    private background: PIXI.Graphics;

    constructor(msg: string, setting: IconButtonSetting) {
        super();

        let radius = setting.radius !== undefined ? setting.radius : DEFAULT_RADIUS;
        let fontSize = setting.fontSize !== undefined ? setting.fontSize : DEFAULT_FONT_SIZE;
        let fontColor = setting.fontColor !== undefined ? setting.fontColor : DEFAULT_FONT_COLOR;
        let color = setting.color !== undefined ? setting.color : DEFAULT_COLOR;

        this.text = new PIXI.Text(msg, {
            fontSize: fontSize,
            align : 'center',
            fontFamily: 'FontAwesome',
            fill: fontColor,
        });

        this.background = new PIXI.Graphics();
        this.background.lineStyle(1);
        this.background.beginFill(color);
        this.background.drawCircle(0, 0, radius);
        this.hitArea = new PIXI.Circle(0, 0, radius);

        this.addChild(this.background);
        this.addChild(this.text);

        centerChild(this.text, 0, 0);

        makeTargetInteractive(this);
    }
}