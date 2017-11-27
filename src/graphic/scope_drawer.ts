import * as _ from "lodash";
import {BlockGraphic, ScopeDrawer} from "./index";
import {Coordinate} from "../common/definition";
import {Block} from "../program/index";
import {Komodi} from "../global";

const FLOW_VERTICAL_MARGIN = 20;
const SPLIT_VERTICAL_MARGIN = 15;
const SPLIT_HORIZONTAL_MARGIN = 40;
const OUTLINE_PADDING = 6;

function defaultDrawScope(
    block: Block,
    getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>,
): PIXI.Rectangle {
    let definition = block.definition;
    let target = block instanceof Block ? block.graphic : block;

    target.graphics.lineStyle(3, 0);

    let widthList: number[] = Array.from(function* () {
        for (let scopeGraphics of getScopeGraphics()) {
            let width = 0;
            for (let graphic of scopeGraphics) {
                width = Math.max(width, graphic.width);
            }
            yield width;
        }
    }());
    let widthSum = _.sum(widthList) + SPLIT_HORIZONTAL_MARGIN * (widthList.length - 1);

    if (definition.scopeNames.length == 1) {
        let attachPoints = [];

        // linear scope
        target.graphics.moveTo(0, 0);
        target.graphics.lineTo(0, FLOW_VERTICAL_MARGIN);
        attachPoints.push({ x: 0, y: FLOW_VERTICAL_MARGIN * .5 });

        let nowY = FLOW_VERTICAL_MARGIN;
        for (let scope of getScopeGraphics()) {
            for (let block of scope) {
                let rect = block.getLocalBounds();
                block.x = 0;
                block.y = nowY + (-rect.top);

                target.graphics.moveTo(0, nowY);
                target.graphics.lineTo(0, nowY+(-rect.top));
                target.graphics.moveTo(0, nowY+rect.height);
                target.graphics.lineTo(0, nowY+rect.height+FLOW_VERTICAL_MARGIN);
                attachPoints.push({ x: 0, y: nowY+rect.height + FLOW_VERTICAL_MARGIN * .5 });

                nowY += rect.height+FLOW_VERTICAL_MARGIN;
            }
        }

        Komodi.attacher.setScopeCoordinate(block, definition.scopeNames[0], attachPoints);

        return new PIXI.Rectangle(-widthSum*.5, 0, widthSum, nowY);
    } else if (definition.scopeNames.length >= 2) {
        // split-join scope
        target.graphics.moveTo(0, 0);
        target.graphics.lineTo(0, SPLIT_VERTICAL_MARGIN);

        // Split
        let endOffset: Coordinate[] = [];
        let nowX = -widthSum * .5;

        let scopeIterator = getScopeGraphics();
        for (let scopeIndex = 0; scopeIndex < widthList.length; scopeIndex++) {
            let attachPoints = [];

            let currentScope = scopeIterator.next().value;

            nowX += widthList[scopeIndex]*.5;
            let nowY = SPLIT_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN;

            target.graphics.moveTo(0, SPLIT_VERTICAL_MARGIN);
            target.graphics.lineTo(nowX, SPLIT_VERTICAL_MARGIN);
            target.graphics.moveTo(nowX, SPLIT_VERTICAL_MARGIN);
            target.graphics.lineTo(nowX, nowY);
            attachPoints.push({ x: nowX, y: SPLIT_VERTICAL_MARGIN + FLOW_VERTICAL_MARGIN * .5 });

            for (let block of currentScope) {
                let rect = block.getLocalBounds();
                block.x = nowX;
                block.y = nowY + (-rect.top);

                target.graphics.moveTo(nowX, nowY);
                target.graphics.lineTo(nowX, nowY+(-rect.top));
                target.graphics.moveTo(nowX, nowY+rect.height);
                target.graphics.lineTo(nowX, nowY+rect.height+FLOW_VERTICAL_MARGIN);
                attachPoints.push({ x: nowX, y: nowY+rect.height + FLOW_VERTICAL_MARGIN * .5 });

                nowY += rect.height+FLOW_VERTICAL_MARGIN;
            }
            endOffset.push({
                x: nowX,
                y: nowY,
            });

            Komodi.attacher.setScopeCoordinate(block, definition.scopeNames[scopeIndex], attachPoints);
            nowX += widthList[scopeIndex]*.5 + SPLIT_HORIZONTAL_MARGIN;
        }

        // Join
        let maxY: number = _(endOffset).map((coord) => coord.y).max()!;
        for (let scopeIndex = 0; scopeIndex < widthList.length; scopeIndex++) {
            const offset = endOffset[scopeIndex];
            target.graphics.moveTo(offset.x, offset.y);
            target.graphics.lineTo(offset.x, maxY);
            target.graphics.moveTo(offset.x, maxY);
            target.graphics.lineTo(0, maxY);
        }
        target.graphics.moveTo(0, maxY);
        target.graphics.lineTo(0, maxY+SPLIT_VERTICAL_MARGIN);

        return new PIXI.Rectangle(-widthSum*.5, 0, widthSum, maxY+SPLIT_VERTICAL_MARGIN);
    } else {
        return new PIXI.Rectangle();
    }
}

class LineScopeDrawer extends ScopeDrawer {
    drawScope(block: Block, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>) {
        defaultDrawScope(block, getScopeGraphics);
    }
}
export const lineScopeDrawer = new LineScopeDrawer();

class BoxScopeDrawer extends ScopeDrawer {
    drawScope(block: Block, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>) {
        let rect = defaultDrawScope(block, getScopeGraphics);

        // draw outline
        block.graphic.graphics.lineStyle(1, 0x9E9E9E);
        block.graphic.graphics.drawRect(
            rect.x - OUTLINE_PADDING, rect.y,
            rect.width + OUTLINE_PADDING*2, rect.height
        );
    }
}
export const boxScopeDrawer = new BoxScopeDrawer();
