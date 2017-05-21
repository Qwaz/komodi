import {Block} from "./Block";
import {ParameterInfo} from "../ui/ParameterRenderer";
import {Parser} from "../parser/Parser";
import {BlockShape} from "../shape/shape";
import {TVoid} from "../type/type";
import {ParameterScope} from "../scope/ParameterScope";
import {AttachInfo} from "../managers/AttachManager";

export class Declaration extends Block {
    private scopeInfoArr: ParameterInfo[];

    static counter = 0;
    private id: number;

    constructor(
        parser: Parser,
        shape: BlockShape
    ) {
        super(parser, shape);

        this.id = Declaration.counter++;

        this.scopeInfoArr = [{
            returnType: new TVoid(),
            label: `var${this.id}`,
        }];
        let scope = new ParameterScope(this, this.scopeInfoArr);
        this.setScope(scope);
    }

    update() {
        let logicChild = this.logicChildren[0];
        this.scopeInfoArr[0] = {
            returnType: logicChild ? logicChild.shape.returnType : new TVoid(),
            label: `var${this.id}`,
        };

        super.update();
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        return attachInfo.attachType != "Logic";
    }
}
