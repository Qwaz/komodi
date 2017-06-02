import * as _ from "lodash";
import {BlockShape, DeclarationShape} from "./shape";
import {Block} from "../controls";
import {TFunction, TVoid, TypeInfo} from "../type";
import {FunctionShape} from "./FunctionShape";

const CURVE_HEIGHT = 6;

const bottom = -CURVE_HEIGHT;

export class CurvedFunctionShape extends FunctionShape implements DeclarationShape {
    clone() {
        return new CurvedFunctionShape(this.argTypes, this.description, this.variableName);
    }

    // TODO: Apply lexer to type info
    constructor(
        private argTypes: TypeInfo[],
        description: string,
        readonly variableName: string,
    ) {
        super(new TFunction(argTypes, new TVoid()), description);
    }

    updateShape(logicChildren: Array<Block | null>) {
        BlockShape.prototype.updateShape.call(this, logicChildren);

        this.drawShape(logicChildren, (widthSum) => {
            let ret = _(_.range(0, Math.PI, 0.05)).flatMap((num) => {
                return [widthSum*.5 - num/Math.PI*widthSum, bottom+Math.sin(num)*CURVE_HEIGHT];
            }).value();
            ret.push(
                -widthSum*.5, bottom,
            );
            return ret;
        })
    }
}