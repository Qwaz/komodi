import * as _ from "lodash";
import {Control} from "./Control";
import {LogicHighlight} from "../shape/Highlight";
import {BlockShape} from "../shape/shape";
import {Komodi} from "../Global";
import {AttachInfo} from "../managers/AttachManager";
import {Parser} from "../parser";

export class Block extends Control {
    logicChildren: Array<Block | null>;
    logicHighlights: LogicHighlight[];

    get numLogic(): number {
        return this.logicChildren.length;
    }

    constructor(
        readonly parser: Parser,
        readonly shape: BlockShape,
    ) {
        super(shape);

        // attach management
        this.logicHighlights = _.map(shape.highlightOffsets, (offset) => {
            let highlight = new LogicHighlight();
            this.addChild(highlight);
            highlight.x = offset.offsetX;
            highlight.y = offset.offsetY;
            return highlight;
        });

        this.logicChildren = _.times(shape.highlightOffsets.length, _.constant(null));

        Komodi.attachManager.registerLogic(this);
    }

    updateShape() {
        this.shape.updateShape(this.logicChildren);
        Komodi.attachManager.updateLogic(this);
    }

    update() {
        this.updateShape();

        // update child position
        for (let i = 0; i < this.numLogic; i++) {
            let offset = this.shape.highlightOffsets[i];
            let child = this.logicChildren[i];
            if (child) {
                child.x = offset.offsetX;
                child.y = offset.offsetY;
            }
        }

        super.update();
    }

    destroy() {
        Komodi.attachManager.deleteLogic(this);

        for (let block of this.logicChildren) {
            if (block) {
                block.destroy();
            }
        }

        super.destroy();
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        if (attachInfo.attachType == "Logic") {
            return attachInfo.requiredType ? this.shape.returnType.equals(attachInfo.requiredType) : true;
        } else {
            return true;
        }
    }
}

export class FlowBlock extends Block {
    attachFilter(attachInfo: AttachInfo): boolean {
        return attachInfo.attachType != "Logic";
    }
}