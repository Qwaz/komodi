import * as PIXI from "pixi.js";
import {Generator} from "./Generator";
import {Parser} from "../parser/parser";
import {Block, FlowItemFactory} from "./controls";
import {FunctionShape} from "../shape/FunctionShape";
import {TFunction, TypeInfo} from "../type/type";

const GENERATOR_PADDING = 6;

export interface ParameterInfo {
    returnType: TypeInfo,
    label: string,
}

export class ParameterRenderer extends PIXI.Container {
    private generators: Generator<Block, Parser, FunctionShape>[] = [];

    constructor() {
        super();
    }

    // TODO: previously created variables are not updated
    update(parameterInfoArr: ParameterInfo[]) {
        this.reset();

        let widthSum = 0, maxHeight = 0;
        for (let info of parameterInfoArr) {
            // TODO: fix flowControl's attachFilter to check its scope parents
            let factory = new FlowItemFactory(
                Block,
                new Parser(`${info.label}`),
                new FunctionShape(
                    new TFunction([], info.returnType),
                    info.label
                )
            );

            let generator = new Generator(factory);
            this.generators.push(generator);
            this.addChild(generator);

            widthSum += generator.width;
            maxHeight = Math.max(maxHeight, generator.height);
        }
        widthSum += GENERATOR_PADDING * (this.generators.length - 1);

        let currentX = -widthSum*.5;
        for (let generator of this.generators) {
            generator.x = currentX + generator.width*.5;
            generator.y = generator.height*.5;
            currentX += generator.width + GENERATOR_PADDING;
        }
    }

    reset() {
        for (let generator of this.generators) {
            this.removeChild(generator);
        }
        this.generators.splice(0, this.generators.length);
    }
}