import * as PIXI from "pixi.js";
import {BlockShape, HitArea} from "./shape";
import {Offset} from "../controllers/AttachController";
import {Block} from "../ui/flow";
import {TFunction, typeInfoToColor} from "../type/type";
import {TRIANGLE_HEIGHT, TRIANGLE_WIDTH} from "./Highlight";

const DEFAULT_ARG_WIDTH = 35;
const MARGIN = 30;
const EMPTY_BLOCK_WIDTH = 35;
const BLOCK_HEIGHT = 30;

const top = -BLOCK_HEIGHT-TRIANGLE_HEIGHT;
const bottom = -TRIANGLE_HEIGHT;

export class FunctionShape extends BlockShape {
    readonly graphics: PIXI.Graphics;
    private _hitArea: PIXI.Polygon;
    private _highlightOffsets: Offset[];

    clone() {
        return new FunctionShape(this.typeInfo);
    }

    // TODO: Apply lexer to type info
    constructor(private typeInfo: TFunction) {
        super();

        this.graphics = new PIXI.Graphics();

        this.updateShape([]);
    }

    get hitArea(): HitArea {
        return this._hitArea;
    }

    get highlightOffsets(): Offset[] {
        return this._highlightOffsets;
    }

    updateShape(logicChildren: Array<Block | null>) {
        this._highlightOffsets = [];

        this.graphics.clear();
        this.graphics.lineStyle(1, 0x000000);

        if (this.typeInfo.args.length > 0) {
            let widthSum = 0;
            let argWidth = [];
            for (let i = 0; i < this.typeInfo.args.length; i++) {
                let child = logicChildren[i];
                if (child) {
                    let size = child.updateAndGetBounds();
                    argWidth.push(size.width);
                } else {
                    argWidth.push(DEFAULT_ARG_WIDTH);
                }
                widthSum += argWidth[i];
            }

            // TODO: Replace uniform margin to label size calculation
            widthSum += (argWidth.length-1) * MARGIN;

            let outlinePath = [];
            let currentX = -widthSum * .5;
            for (let i = 0; i < this.typeInfo.args.length; i++) {
                let width = argWidth[i];
                outlinePath.push(
                    currentX, top,
                    currentX+width*.5-TRIANGLE_WIDTH*.5, top,
                    currentX+width*.5, top+TRIANGLE_HEIGHT,
                    currentX+width*.5+TRIANGLE_WIDTH*.5, top,
                    currentX+width, top,
                );
                currentX += width + MARGIN;
            }

            this.graphics.beginFill(typeInfoToColor(this.typeInfo.returns));
            outlinePath.push(
                widthSum*.5, bottom,
                TRIANGLE_WIDTH*.5, bottom,
                0, 0,
                -TRIANGLE_WIDTH*.5, bottom,
                -widthSum*.5, bottom,
                -widthSum*.5, top,
            );
            this.graphics.drawPolygon(outlinePath);

            this._hitArea = new PIXI.Polygon(outlinePath);

            currentX = -widthSum * .5;
            for (let i = 0; i < this.typeInfo.args.length; i++) {
                let width = argWidth[i];
                this.graphics.beginFill(typeInfoToColor(this.typeInfo.args[i]));
                this.graphics.drawPolygon([
                    currentX, top,
                    currentX+width*.5-TRIANGLE_WIDTH*.5, top,
                    currentX+width*.5, top+TRIANGLE_HEIGHT,
                    currentX+width*.5+TRIANGLE_WIDTH*.5, top,
                    currentX+width, top,
                    currentX+width, bottom,
                    currentX, bottom,
                    currentX, top,
                ]);
                this._highlightOffsets.push({
                    offsetX: currentX+width*.5,
                    offsetY: top+TRIANGLE_HEIGHT,
                });
                currentX += width + MARGIN;
            }
        } else {
            this.graphics.beginFill(typeInfoToColor(this.typeInfo.returns));
            let path = [
                -EMPTY_BLOCK_WIDTH*.5, top,
                EMPTY_BLOCK_WIDTH*.5, top,
                EMPTY_BLOCK_WIDTH*.5, bottom,
                TRIANGLE_WIDTH*.5, bottom,
                0, 0,
                -TRIANGLE_WIDTH*.5, bottom,
                -EMPTY_BLOCK_WIDTH*.5, bottom,
                -EMPTY_BLOCK_WIDTH*.5, top,
            ];
            this.graphics.drawPolygon(path);
            this._hitArea = new PIXI.Polygon(path);
        }
    }
}