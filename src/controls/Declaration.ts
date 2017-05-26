import {Block} from "./Block";
import {ParameterInfo} from "../ui/ParameterRenderer";
import {TVoid} from "../type/type";
import {ParameterScope} from "../scope/ParameterScope";
import {AttachInfo} from "../managers/AttachManager";
import {DeclarationParser} from "../parser/Parser";
import {DeclarationShape} from "../shape/DeclarationShape";

export class Declaration extends Block {
    private scopeInfoArr: ParameterInfo[];

    constructor(
        readonly parser: DeclarationParser,
        readonly shape: DeclarationShape
    ) {
        super(parser, shape);

        this.scopeInfoArr = [{
            returnType: new TVoid(),
            label: shape.variableName,
            value: parser.id,
        }];
        let scope = new ParameterScope(this, this.scopeInfoArr);
        this.setScope(scope);
    }

    update() {
        let logicChild = this.logicChildren[0];
        this.scopeInfoArr[0] = {
            returnType: logicChild ? logicChild.shape.returnType : new TVoid(),
            label: this.shape.variableName,
            value: this.parser.id,
        };

        super.update();
    }

    attachFilter(attachInfo: AttachInfo): boolean {
        return attachInfo.attachType != "Logic";
    }
}
