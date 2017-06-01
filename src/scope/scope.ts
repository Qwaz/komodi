import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {Control} from "../controls";
import {FlowHighlight} from "../shape/Highlight";
import {EDIT_POINT_RADIUS, FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Komodi} from "../Global";

export function initFlowGraphics(graphics: PIXI.Graphics) {
    graphics.clear();
    graphics.lineStyle(3, 0);
}

export function drawEditPoint(graphics: PIXI.Graphics, x: number, y: number) {
    graphics.beginFill(0xFFFFFF);
    graphics.drawCircle(x, y, EDIT_POINT_RADIUS);
    graphics.endFill();
}

export function drawLinear(graphics: PIXI.Graphics, startX: number, startY: number, now: Control | null, updating: boolean): Offset {
    let nowX = startX;
    let nowY = startY;

    let lineDelta = (x: number, y: number) => {
        graphics.moveTo(nowX, nowY);
        graphics.lineTo(nowX+x, nowY+y);
        nowX += x;
        nowY += y;
    };

    while (now) {
        if (updating) {
            now.update();
        }

        let size = now.getLocalBounds();

        lineDelta(0, -size.top);

        now.x = nowX;
        now.y = nowY;
        nowY += size.bottom;

        let prevY = nowY;
        lineDelta(0, FLOW_VERTICAL_MARGIN);

        let flowX = nowX;
        let flowY = (nowY + prevY)*.5;
        drawEditPoint(graphics, flowX, flowY);

        Komodi.attachManager.updateFlow(now, {
            offsetX: 0,
            offsetY: size.bottom + FLOW_VERTICAL_MARGIN * .5,
        });

        now = now.flow;
    }

    return {
        offsetX: nowX,
        offsetY: nowY,
    };
}

export abstract class Scope extends PIXI.Container {
    readonly scopeChildren: Array<Control | null>;
    readonly highlights: FlowHighlight[];

    protected graphics: PIXI.Graphics;

    get numScope(): number {
        return this.scopeChildren.length;
    }

    constructor(readonly control: Control, numScope: number) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.scopeChildren = _.times(numScope, _.constant(null));

        this.highlights = _.times(numScope, () => {
            let highlight = new FlowHighlight();
            this.addChild(highlight);
            return highlight;
        });
    }

    drawScope(): Offset {
        return {
            offsetX: 0,
            offsetY: 0,
        }
    };

    destroy() {
        for (let child of this.scopeChildren) {
            if (child) {
                child.destroy();
            }
        }

        super.destroy();
    }
}