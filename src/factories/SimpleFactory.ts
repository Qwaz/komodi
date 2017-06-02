import {Shape} from "../shape/shape";
import {Control} from "../controls";
import {Parser} from "../parser";
import {ControlFactory} from "./ControlFactory";
import {SimpleGenerator} from "../ui/SimpleGenerator";

export class SimpleFactory<F extends Control, P extends Parser, S extends Shape> extends ControlFactory<F, P, S> {
    constructor(
        constructor: {new (parser: P, shape: S): F},
        readonly parser: P,
        readonly shape: S
    ) {
        super(constructor)
    }

    get generator() {
        return SimpleGenerator;
    }

    createControl(): F {
        return new this.constructor(this.parser, this.shape.clone());
    }
}