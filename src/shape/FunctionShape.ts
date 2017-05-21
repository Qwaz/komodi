import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {BlockShape, createLabel} from "./shape";
import {Block} from "../controls";
import {TFunction, TypeInfo, typeInfoToColor} from "../type/type";
import {centerChild} from "../utils";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH, TypedOffset} from "../common";

const MINIMUM_ARG_WIDTH = 35;
const PADDING = 5;
const BLOCK_HEIGHT = 33;

const top = -BLOCK_HEIGHT-TRIANGLE_HEIGHT;
const bottom = -TRIANGLE_HEIGHT;

export class FunctionShape extends BlockShape {
    private graphics: PIXI.Graphics;
    private _highlightOffsets: TypedOffset[];

    private argLabels: PIXI.Text[] = [];
    private textLabels: PIXI.Text[] = [];

    clone() {
        return new FunctionShape(this.typeInfo, this.description);
    }

    // TODO: Apply lexer to type info
    constructor(
        private typeInfo: TFunction,
        private description: string,
    ) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        let getAllIndex = function (text: string, searchString: string): number[] {
            let ret = [];

            let position = 0;
            while (true) {
                let cand = text.indexOf(searchString, position);
                if (cand == -1) break;
                else {
                    ret.push(cand);
                    position = cand+1;
                }
            }

            return ret;
        };

        let openIndex = getAllIndex(description, '(');
        let closeIndex = getAllIndex(description, ')');

        if (openIndex.length != closeIndex.length) {
            throw Error("Number of parenthesis does not match");
        }

        this.argLabels = _.zip(openIndex, closeIndex)
            .map(([start, end]) => createLabel(description.slice(start+1, end)));

        this.textLabels = _.concat(
            [createLabel(description.slice(0, openIndex[0]))],
            _.zip(_.tail(openIndex), closeIndex)
                .map(([start, end]) => createLabel(description.slice(end+1, start)))
        );

        _.forEach(this.argLabels, (label) => this.addChild(label));
        _.forEach(this.textLabels, (label) => this.addChild(label));

        this.updateShape([]);
    }

    get returnType(): TypeInfo {
        return this.typeInfo.returns;
    }

    get highlightOffsets(): TypedOffset[] {
        return this._highlightOffsets;
    }

    updateShape(logicChildren: Array<Block | null>) {
        super.updateShape(logicChildren);

        this._highlightOffsets = [];

        this.graphics.clear();
        this.graphics.lineStyle(1, 0x000000);

        let labels = _.dropRight(_.flatten(_.zip(this.textLabels, this.argLabels)));

        let forEachLabel = function (
            startVal: number,
            func?: (nowX: number, width: number, label: PIXI.Text, i: number) => void
        ) {
            return _(labels).reduce((nowX, label, i) => {
                let width = 0;
                if (i % 2 == 0) {
                    // text label
                    // TODO: PIXI.Text seems to convert empty string to a space
                    width = label.text == " " ? PADDING : label.width + PADDING*2;
                } else {
                    // argument label
                    let child = logicChildren[i >> 1];

                    let childWidth = 0;
                    if (child) {
                        childWidth = Math.max(child.getBounds().width, MINIMUM_ARG_WIDTH);
                    } else {
                        childWidth = MINIMUM_ARG_WIDTH;
                    }

                    width = Math.max(label.width, childWidth) + PADDING*2;
                }

                if (func) {
                    func(nowX, width, label, i);
                }

                return nowX+width;
            }, startVal);
        };

        let widthSum = forEachLabel(0);

        // draw outline
        let outlinePath = [
            -widthSum*.5, top,
        ];
        forEachLabel(-widthSum*.5, (nowX, width, _label, i) => {
            if (i % 2 == 1) {
                outlinePath.push(
                    nowX+width*.5 - TRIANGLE_WIDTH*.5, top,
                    nowX+width*.5, top+TRIANGLE_HEIGHT,
                    nowX+width*.5 + TRIANGLE_WIDTH*.5, top,
                )
            }
        });
        outlinePath.push(
            widthSum*.5, top,
            widthSum*.5, bottom,
            TRIANGLE_WIDTH*.5, bottom,
            0, 0,
            -TRIANGLE_WIDTH*.5, bottom,
            -widthSum*.5, bottom,
            -widthSum*.5, top,
        );
        this.graphics.beginFill(typeInfoToColor(this.typeInfo.returns));
        this.graphics.drawPolygon(outlinePath);
        this.hitArea = new PIXI.Polygon(outlinePath);

        // draw argument
        forEachLabel(-widthSum*.5, (nowX, width, _label, i) => {
            if (i % 2 == 1) {
                this.graphics.beginFill(typeInfoToColor(this.typeInfo.args[i >> 1]));
                this.graphics.drawPolygon([
                    nowX, top,
                    nowX+width*.5-TRIANGLE_WIDTH*.5, top,
                    nowX+width*.5, top+TRIANGLE_HEIGHT,
                    nowX+width*.5+TRIANGLE_WIDTH*.5, top,
                    nowX+width, top,
                    nowX+width, bottom-PADDING,
                    nowX, bottom-PADDING,
                    nowX, top,
                ]);
                this._highlightOffsets.push({
                    offsetX: nowX+width*.5,
                    offsetY: top+TRIANGLE_HEIGHT,
                    requiredType: this.typeInfo.args[i >> 1],
                });
            }
        });

        // position labels
        forEachLabel(-widthSum*.5, (nowX, width, label) => {
           centerChild(label, nowX+width*.5, bottom-BLOCK_HEIGHT*.5);
        });
    }
}