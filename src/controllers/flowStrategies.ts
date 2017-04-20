import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {FlowControl} from "../ui/flow";
import {Global} from "../entry";
import {Offset} from "./AttachController";

export type FlowStrategy = (graphics: PIXI.Graphics, start: FlowControl) => Offset;

const FLOW_VERTICAL_MARGIN = 45;
const EDIT_POINT_RADIUS = 6;

function setGraphicsStyle(graphics: PIXI.Graphics) {
    graphics.lineStyle(3, 0);
}

export function drawEditPoint(graphics: PIXI.Graphics, x: number, y: number, highlight: boolean = false) {
    if (highlight) {
        graphics.beginFill(0xFF0000, 0.7);
    } else {
        graphics.beginFill(0xFFFFFF);
    }
    graphics.drawCircle(x, y, EDIT_POINT_RADIUS);
    graphics.endFill();
}

function drawLinear(graphics: PIXI.Graphics, origin: FlowControl, startX: number, startY: number, now: FlowControl | null): Offset {
    let nowX = startX;
    let nowY = startY;

    let lineDelta = (x: number, y: number) => {
        graphics.moveTo(nowX, nowY);
        graphics.lineTo(nowX+x, nowY+y);
        nowX += x;
        nowY += y;
    };

    while (now) {
        let size = now.updateAndGetBounds();
        let offset = size.bottom - now.y;

        if (now.numFlow == 0) {
            lineDelta(0, size.height);
        } else {
            lineDelta(0, now.y - size.top);
            nowY += offset;
        }
        now.x = origin.x + nowX;
        now.y = origin.y + nowY - offset;
        now.updateAndGetBounds();

        let prevY = nowY;
        lineDelta(0, FLOW_VERTICAL_MARGIN);

        let flowX = nowX;
        let flowY = (nowY + prevY)*.5;
        drawEditPoint(graphics, flowX, flowY);
        Global.attachController.updateFlowOffset(now, 0, {
            offsetX: flowX + (origin.x - now.x),
            offsetY: flowY + (origin.y - now.y),
        });

        now = now.flowChildren[0];
    }

    return {
        offsetX: nowX,
        offsetY: nowY,
    };
}

export let noStrategy: FlowStrategy = function (): Offset {
    return {
        offsetX: 0,
        offsetY: 0,
    };
};

const SPLIT_JOIN_VERTICAL_MARGIN = 15;
const SPLIT_JOIN_HORIZONTAL_MARGIN = 40;

export let splitJoinStrategy: FlowStrategy = function (graphics: PIXI.Graphics, start: FlowControl) {
    if (start.numFlow > 0) {
        // pre-calculate each flow's width
        let widthList = _.fill(Array(start.numFlow), 0);

        for (let i = 0; i < start.numFlow; i++) {
            let now = start.flowChildren[i+1];
            while (now) {
                let widthCandidate = now.updateAndGetBounds().width;
                if (widthList[i] < widthCandidate) {
                    widthList[i] = widthCandidate;
                }
                now = now.flowChildren[0];
            }
        }

        // Split
        setGraphicsStyle(graphics);

        graphics.moveTo(0, 0);
        graphics.lineTo(0, SPLIT_JOIN_VERTICAL_MARGIN);

        let endOffset: Offset[] = [];
        let widthSum = _.sum(widthList) + SPLIT_JOIN_HORIZONTAL_MARGIN * (widthList.length-1);
        let splitX = -widthSum * .5;

        for (let flowIndex = 0; flowIndex < start.numFlow; flowIndex++) {
            splitX += widthList[flowIndex]*.5;
            const editY = SPLIT_JOIN_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN*.5;
            const nextY = SPLIT_JOIN_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN;

            graphics.moveTo(0, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.lineTo(splitX, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.moveTo(splitX, SPLIT_JOIN_VERTICAL_MARGIN);
            graphics.lineTo(splitX, nextY);

            drawEditPoint(graphics, splitX, editY);
            Global.attachController.updateFlowOffset(start, flowIndex+1, {
                offsetX: splitX,
                offsetY: editY,
            });

            endOffset.push(
                drawLinear(graphics, start, splitX, nextY, start.flowChildren[flowIndex+1])
            );

            splitX += widthList[flowIndex]*.5 + SPLIT_JOIN_HORIZONTAL_MARGIN;
        }

        // Join
        let maxY = _(endOffset).map((obj: Offset) => obj.offsetY).max();
        for (let flowIndex = 0; flowIndex < start.numFlow; flowIndex++) {
            const offset = endOffset[flowIndex];
            graphics.moveTo(offset.offsetX, offset.offsetY);
            graphics.lineTo(offset.offsetX, maxY);
            graphics.moveTo(offset.offsetX, maxY);
            graphics.lineTo(0, maxY);
        }
        graphics.moveTo(0, maxY);
        graphics.lineTo(0, maxY+SPLIT_JOIN_VERTICAL_MARGIN);

        return {
            offsetX: 0,
            offsetY: maxY+SPLIT_JOIN_VERTICAL_MARGIN,
        };
    } else {
        return {
            offsetX: 0,
            offsetY: 0,
        };
    }
};