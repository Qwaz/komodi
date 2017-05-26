import {BlockShape} from "../shape/shape";
import {Block, Control} from "../controls";
import {SimpleFactory} from "./SimpleFactory";
import {AttachInfo} from "../managers/AttachManager";
import {ParameterInfo} from "../ui/ParameterRenderer";
import {FunctionShape} from "../shape/FunctionShape";
import {TFunction} from "../type/type";
import {Global} from "../entry";
import {Parser, PatternParser} from "../parser/Parser";

export class ScopedFactory extends SimpleFactory<Block, Parser, BlockShape> {
    private generated = new Set<Block>();

    constructor(private scopeParent: Control, readonly info: ParameterInfo) {
        super(
            Block,
            new PatternParser(`${info.value}`),
            new FunctionShape(
                new TFunction([], info.returnType),
                info.label,
            ),
        );
    }

    createControl(): Block {
        let control = new this.constructor(this.parser, this.shape.clone());

        this.generated.add(control);

        let prevFilter = control.attachFilter.bind(control);
        control.attachFilter = (attachInfo: AttachInfo) => {
            let scopeChanged = attachInfo.attachType == "Scope";

            let now = attachInfo.attachTo;
            while (true) {
                if (now == this.scopeParent) {
                    // no recursive use
                    return scopeChanged && prevFilter(attachInfo);
                }

                if (!now.attachParent) break;

                scopeChanged = scopeChanged || now.attachParent.attachType == "Scope";
                now = now.attachParent.attachTo;
            }

            return false;
        };

        let prevDestroy = control.destroy.bind(control);
        control.destroy = () => {
            this.generated.delete(control);
            prevDestroy();
        };

        return control;
    }

    destroyAll() {
        for (let control of this.generated) {
            Global.attachManager.detachControl(control);
            control.destroy();
        }
    }
}