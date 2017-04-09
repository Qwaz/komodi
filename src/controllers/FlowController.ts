import {Block, FlowControl, Signal} from "../ui/flow";
import {Global} from "../entry";

const FLOW_MARGIN = 60;
const EDIT_POINT_RADIUS = 8;

function setGraphicsStyle(graphics: PIXI.Graphics, highlight: boolean = false) {
    graphics.lineStyle(4, 0);
    if (highlight) {
        graphics.beginFill(0xFF0000, 0.7);
    } else {
        graphics.beginFill(0xFFFFFF);
    }
}

export class Flow extends PIXI.Container {
    private graphics: PIXI.Graphics;

    constructor(private start: FlowControl) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
        start.addChild(this);

        this.update();
    }

    static generateFlowHighlights(target: FlowControl) {
        let ret = [];
        for (let i = 0; i < target.numFlow+1; i++) {
            let graphics = new PIXI.Graphics();
            setGraphicsStyle(graphics, true);
            graphics.drawCircle(0, 0, EDIT_POINT_RADIUS);
            graphics.visible = false;
            target.addChild(graphics);
            ret.push(graphics);
        }

        return ret;
    }

    update(): void {
        this.graphics.clear();
        setGraphicsStyle(this.graphics);

        let nowX = 0;
        let nowY = 0;

        let lineDelta = (x: number, y: number) => {
            this.graphics.moveTo(nowX, nowY);
            this.graphics.lineTo(nowX+x, nowY+y);
            nowX += x;
            nowY += y;
        };

        let now: FlowControl | null = this.start;
        while (now) {
            if (now.numFlow == 0) {
                let prevY = nowY;
                lineDelta(0, FLOW_MARGIN);

                let flowX = nowX;
                let flowY = (nowY + prevY)*.5;
                this.graphics.drawCircle(flowX, flowY, EDIT_POINT_RADIUS);
                Global.attachController.updateFlowOffset(now, 0, {
                    offsetX: (this.start.x + flowX) - now.x,
                    offsetY: (this.start.y + flowY) - now.y,
                });
            } else {
                // TODO: Apply flowStrategy
            }

            let next: FlowControl | null = now.flowChildren[0];
            if (next) {
                let size = next.calculateElementSize();
                lineDelta(0, size.height);
                next.x = this.start.x + nowX;
                next.y = this.start.y + nowY;
                if (next instanceof Block) {
                    next.updateChildrenPosition();
                }
            }

            now = next;
        }
    }
}

export class FlowController {
    private signals: Map<Signal, Flow> = new Map<Signal, Flow>();

    registerSignal(signal: Signal) {
        this.signals.set(signal, new Flow(signal));
    }

    deleteSignal(signal: Signal) {
        this.signals.delete(signal);
    }

    update(signal: Signal) {
        this.signals.get(signal).update();
    }
}