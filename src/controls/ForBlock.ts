import {ParameterInfo} from "../ui/ParameterRenderer";
import {TNumber} from "../type";
import {ParameterScope} from "../scope/ParameterScope";
import {FlowBlock} from "./Block";
import {ParameterParser} from "../parser/index";
import {DeclarationShape} from "../shape/shape";

export class ForBlock extends FlowBlock {
    private scopeInfoArr: ParameterInfo[];

    constructor(
        readonly parser: ParameterParser,
        readonly shape: DeclarationShape
    ) {
        super(parser, shape);

        this.scopeInfoArr = [{
            returnType: new TNumber(),
            label: shape.variableName,
            value: parser.id,
        }];
        let scope = new ParameterScope(this, this.scopeInfoArr);
        this.setScope(scope);
    }
}
