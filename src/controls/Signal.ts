import {Control} from "./Control";
import {Shape} from "../shape/shape";
import {LinearScope} from "../scope/LinearScope";
import {Komodi} from "../Global";
import {Parser} from "../parser/Parser";

export class Signal extends Control {
    constructor(readonly parser: Parser, shape: Shape) {
        super(shape);

        this.setScope(new LinearScope(this));

        Komodi.globalManager.registerGlobal(this);
    }

    destroy() {
        Komodi.globalManager.deleteGlobal(this);

        super.destroy();
    }
}