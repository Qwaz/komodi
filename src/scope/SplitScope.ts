import * as _ from "lodash";
import {drawEditPoint, drawLinear, initFlowGraphics, Scope} from "./scope";
import {Control} from "../ui/controls";
import {FLOW_VERTICAL_MARGIN, Offset} from "../common";
import {Global} from "../entry";

const SPLIT_VERTICAL_PADDING = 15;
const SPLIT_HORIZONTAL_PADDING = 40;

export class SplitScope extends Scope {
    constructor(control: Control, numScope: number) {
        super(control, numScope);
    }

    drawScope(): Offset {
        // pre-calculate each scope's width
        let widthList = _.fill(Array(this.numScope), 0);

        for (let i = 0; i < this.numScope; i++) {
            let now = this.scopeChildren[i];
            while (now) {
                now.update();

                let widthCandidate = now.getBounds().width;
                if (widthList[i] < widthCandidate) {
                    widthList[i] = widthCandidate;
                }
                now = now.flow;
            }
        }

        // Split
        initFlowGraphics(this.graphics);

        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(0, SPLIT_VERTICAL_PADDING);

        let endOffset: Offset[] = [];
        let widthSum = _.sum(widthList) + SPLIT_HORIZONTAL_PADDING * (widthList.length-1);
        let splitX = -widthSum * .5;

        for (let flowIndex = 0; flowIndex < this.numScope; flowIndex++) {
            splitX += widthList[flowIndex]*.5;
            const editY = SPLIT_VERTICAL_PADDING + FLOW_VERTICAL_MARGIN*.5;
            const nextY = SPLIT_VERTICAL_PADDING + FLOW_VERTICAL_MARGIN;

            this.graphics.moveTo(0, SPLIT_VERTICAL_PADDING);
            this.graphics.lineTo(splitX, SPLIT_VERTICAL_PADDING);
            this.graphics.moveTo(splitX, SPLIT_VERTICAL_PADDING);
            this.graphics.lineTo(splitX, nextY);

            drawEditPoint(this.graphics, splitX, editY);
            Global.attachManager.updateScope(this, flowIndex, {
                offsetX: splitX,
                offsetY: editY,
            });

            endOffset.push(
                drawLinear(this.graphics, splitX, nextY, this.scopeChildren[flowIndex], false)
            );

            splitX += widthList[flowIndex]*.5 + SPLIT_HORIZONTAL_PADDING;
        }

        // Join
        let maxY = _(endOffset).map((obj: Offset) => obj.offsetY).max();
        for (let flowIndex = 0; flowIndex < this.numScope; flowIndex++) {
            const offset = endOffset[flowIndex];
            this.graphics.moveTo(offset.offsetX, offset.offsetY);
            this.graphics.lineTo(offset.offsetX, maxY);
            this.graphics.moveTo(offset.offsetX, maxY);
            this.graphics.lineTo(0, maxY);
        }
        this.graphics.moveTo(0, maxY);
        this.graphics.lineTo(0, maxY+SPLIT_VERTICAL_PADDING);

        return {
            offsetX: 0,
            offsetY: maxY+SPLIT_VERTICAL_PADDING,
        };
    }
}