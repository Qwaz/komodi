import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {Block} from "../controls";
import {TypeInfo} from "../type";
import {TypedOffset} from "../common";

export abstract class Shape extends PIXI.Container {
    abstract clone(): this;
}

export abstract class BlockShape extends Shape {
    abstract get returnType(): TypeInfo;
    abstract get highlightOffsets(): TypedOffset[];

    updateShape(logicChildren: Array<Block | null>): void {
        _(logicChildren).forEach((block) => {
            if (block) {
                block.update();
            }
        })
    };
}

export interface DeclarationShape extends BlockShape {
    variableName: string;
}