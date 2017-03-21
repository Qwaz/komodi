const BUBBLE_WIDTH = 100;
const BUBBLE_HEIGHT = 60;
const TRIANGLE_WIDTH = 20;
const TRIANGLE_HEIGHT = 15;

const left = -BUBBLE_WIDTH*.5;
const top = -BUBBLE_HEIGHT*.5;
const right = -left;
const bottom = -top;

export default class BubbleShape extends PIXI.Graphics {
    static readonly hitArea = new PIXI.Rectangle(left, top, BUBBLE_WIDTH, BUBBLE_HEIGHT);

    static readonly BUBBLE_HEIGHT = BUBBLE_HEIGHT;

    constructor(color: number, highlighted: boolean) {
        super();

        let path = [
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
        ];

        this.lineStyle(1, 0x000000, 1);
        this.beginFill(color);
        this.drawPolygon(path);
        this.endFill();

        if (highlighted) {
            this.lineStyle(4, 0xFF0000, 1);
            this.moveTo(path[0], path[1]);
            for (let i = 1; i <= 4; i++) {
                this.lineTo(path[i*2], path[i*2+1]);
            }
        }
    }
}