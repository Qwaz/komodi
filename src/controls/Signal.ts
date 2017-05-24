import {Control} from "./Control";
import {Shape} from "../shape/shape";
import {LinearScope} from "../scope/LinearScope";
import {Global} from "../entry";
import {Parser} from "../parser/Parser";

export class Signal extends Control {
    constructor(readonly parser: Parser, shape: Shape) {
        super(shape);

        this.setScope(new LinearScope(this));

        Global.globalManager.registerGlobal(this);
    }

    destroy() {
        Global.globalManager.deleteGlobal(this);

        super.destroy();
    }
}