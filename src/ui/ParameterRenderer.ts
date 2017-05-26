import * as PIXI from "pixi.js";
import {SimpleGenerator} from "./SimpleGenerator";
import {Block, Control} from "../controls";
import {TypeInfo} from "../type/type";
import {ScopedFactory} from "../factories/ScopedFactory";
import {BlockShape} from "../shape/shape";
import {Parser} from "../parser/Parser";

const GENERATOR_PADDING = 6;

export interface ParameterInfo {
    returnType: TypeInfo,
    label: string,
    value: string,
}

export class ParameterRenderer extends PIXI.Container {
    private factories: ScopedFactory[] = [];
    private generators: SimpleGenerator<Block, Parser, BlockShape>[] = [];

    constructor(readonly scopeParent: Control) {
        super();
    }

    update(parameterInfoArr: ParameterInfo[]) {
        if (parameterInfoArr.length == this.factories.length) {
            const len = parameterInfoArr.length;

            let i;
            for (i = 0; i < len; i++) {
                if (!parameterInfoArr[i].returnType.equals(this.factories[i].info.returnType) ||
                    parameterInfoArr[i].label != this.factories[i].info.label)
                    break;
            }

            // no changes
            if (i == len) {
                return;
            }
        }

        this.reset();

        let widthSum = 0, maxHeight = 0;
        for (let info of parameterInfoArr) {
            let factory = new ScopedFactory(this.scopeParent, info);

            let generator = new SimpleGenerator(factory);
            this.addChild(generator);

            widthSum += generator.width;
            maxHeight = Math.max(maxHeight, generator.height);

            this.factories.push(factory);
            this.generators.push(generator);
        }
        widthSum += GENERATOR_PADDING * (this.generators.length - 1);

        let currentX = -widthSum*.5;
        for (let generator of this.generators) {
            generator.x = currentX + generator.width*.5;
            generator.y = generator.height*.5;
            currentX += generator.width + GENERATOR_PADDING;
        }
    }

    destroy() {
        this.reset();
        super.destroy();
    }

    reset() {
        for (let factory of this.factories) {
            factory.destroyAll();
        }
        this.factories.splice(0, this.factories.length);

        for (let generator of this.generators) {
            this.removeChild(generator);
        }
        this.generators.splice(0, this.generators.length);
    }
}