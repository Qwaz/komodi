import * as _ from "lodash";
import {BlockGraphic, NodeDrawer, Token} from "./index";
import {BlockDefinition} from "../program/definition_parser";
import {typeToColor} from "../type";
import {centerChild} from "../utils";

const MINIMUM_ARG_WIDTH = 26;
const PADDING = 5;
const ROUNDED_RADIUS = 7;
const BLOCK_HEIGHT = 33;

const TIP_WIDTH = 12;
const TIP_HEIGHT = 9;
const CURVE_HEIGHT = 6;
const SIGNAL_GAP = 4;
const SIGNAL_LINE = 4;

function defaultDrawNode(
    definition: BlockDefinition,
    target: BlockGraphic,
    getArgumentGraphics: () => IterableIterator<BlockGraphic | null>,
    bottom: number,
    bottomOutline: (widthSum: number) => number[]
): number {
    const top = bottom - BLOCK_HEIGHT;

    target.graphics.lineStyle(1, 0);

    let tokenStrings = _.map(definition.tokens, (token) => {
        switch (token.kind) {
            case "placeholder":
                return token.text;
            case "user_input":
                // TODO: handle user input correctly
                return token.identifier;
            case "expression":
                return token.identifier;
        }
    });

    target.releaseLabels();
    let labels = _.map(tokenStrings, (str) => target.assignLabel(str));

    let cnt = 0;
    let tokenToWidth = (token: Token, index: number | undefined) => {
        if (index == undefined) {
            index = cnt++;
        }
        switch (token.kind) {
            case "placeholder":
                return labels[index].width + PADDING;
            case "user_input":
                return labels[index].width + PADDING * 2;
            case "expression":
                let child = argumentIterator.next().value;
                let childWidth = child ? Math.max(child.getBounds().width, MINIMUM_ARG_WIDTH) : MINIMUM_ARG_WIDTH;
                return Math.max(labels[index].width + PADDING * 2, childWidth);
        }
    };

    // calculate widthSum
    let argumentIterator = getArgumentGraphics();
    let widthSum = _.sumBy(definition.tokens, tokenToWidth) + PADDING * 2;

    // place labels
    argumentIterator = getArgumentGraphics();
    let nowX = -widthSum*.5 + PADDING;
    _.forEach(definition.tokens, (token, i) => {
        let width = tokenToWidth(token, i);
        centerChild(labels[i], nowX+width*.5, bottom-BLOCK_HEIGHT*.5);
        nowX += width;
    });

    // draw outline
    cnt = 0;
    argumentIterator = getArgumentGraphics();
    nowX = -widthSum*.5 + PADDING;
    let outlinePath = [-widthSum*.5, top];
    _.forEach(definition.tokens, (token, i) => {
        let width = tokenToWidth(token, i);
        switch (token.kind) {
            case "expression":
                outlinePath.push(
                    nowX+width*.5 - TIP_WIDTH*.5, top,
                    nowX+width*.5, top+TIP_HEIGHT,
                    nowX+width*.5 + TIP_WIDTH*.5, top,
                )
        }
        nowX += width;
    });
    outlinePath.push(widthSum*.5, top);
    outlinePath = outlinePath.concat(bottomOutline(widthSum));
    outlinePath.push(-widthSum*.5, top);
    target.graphics.beginFill(typeToColor(definition.returnType));
    target.graphics.drawPolygon(outlinePath);
    target.hitArea = new PIXI.Polygon(outlinePath);

    // draw arguments
    argumentIterator = getArgumentGraphics();
    let secondIterator = getArgumentGraphics();
    nowX = -widthSum*.5 + PADDING;
    _.forEach(definition.tokens, (token, i) => {
        let width = tokenToWidth(token, i);
        switch (token.kind) {
            case "user_input":
                target.graphics.beginFill(typeToColor(token.type));
                target.graphics.drawRoundedRect(
                    nowX, top+PADDING,
                    width,BLOCK_HEIGHT-2*PADDING,
                    ROUNDED_RADIUS
                );
                break;
            case "expression":
                let graphic = secondIterator.next().value;
                target.graphics.beginFill(typeToColor(token.type));
                target.graphics.drawPolygon([
                    nowX, top,
                    nowX+width*.5-TIP_WIDTH*.5, top,
                    nowX+width*.5, top+TIP_HEIGHT,
                    nowX+width*.5+TIP_WIDTH*.5, top,
                    nowX+width, top,
                    nowX+width, bottom-PADDING,
                    nowX, bottom-PADDING,
                    nowX, top,
                ]);

                if (graphic) {
                    graphic.x = nowX+width*.5;
                    graphic.y = top+TIP_HEIGHT;
                }
                break;
        }
        nowX += width;
    });

    return widthSum;
}

class FunctionNodeDrawer extends NodeDrawer {
    drawNode(definition: BlockDefinition, target: BlockGraphic, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>) {
        defaultDrawNode(definition, target, getArgumentGraphics, -TIP_HEIGHT, (widthSum) => [
            widthSum*.5, -TIP_HEIGHT,
            TIP_WIDTH*.5, -TIP_HEIGHT,
            0, 0,
            -TIP_WIDTH*.5, -TIP_HEIGHT,
            -widthSum*.5, -TIP_HEIGHT,
        ]);
    }
}
export const functionNodeDrawer = new FunctionNodeDrawer();

class CommandNodeDrawer extends NodeDrawer {
    drawNode(definition: BlockDefinition, target: BlockGraphic, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>) {
        defaultDrawNode(definition, target, getArgumentGraphics, -CURVE_HEIGHT, (widthSum) => {
            let ret = _(_.range(0, 1, 0.04)).flatMap((num) => {
                return [widthSum*.5 - num*widthSum, -CURVE_HEIGHT+Math.sin(num * Math.PI)*CURVE_HEIGHT];
            }).value();
            ret.push(
                -widthSum*.5, -CURVE_HEIGHT,
            );
            return ret;
        });
    }
}
export const commandNodeDrawer = new CommandNodeDrawer();

class SignalNodeDrawer extends NodeDrawer {
    drawNode(definition: BlockDefinition, target: BlockGraphic, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>) {
        let widthSum = defaultDrawNode(definition, target, getArgumentGraphics, -SIGNAL_GAP-SIGNAL_LINE, (widthSum) => [
            widthSum * .5, -SIGNAL_GAP-SIGNAL_LINE,
            -widthSum * .5, -SIGNAL_GAP-SIGNAL_LINE,
        ]);

        target.graphics.drawRect(-widthSum * .5, -SIGNAL_LINE, widthSum, SIGNAL_LINE);
    }
}
export const signalNodeDrawer = new SignalNodeDrawer();
