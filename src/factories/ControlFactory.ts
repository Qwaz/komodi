import {Shape} from "../shape/shape";
import {Control} from "../controls";
import {Parser} from "../parser/Parser";

export class ControlFactory<F extends Control, L extends Parser, S extends Shape> {
    constructor(protected constructor: {new (parser: L, shape: S): F}, readonly parser: L, readonly shape: S) {
    }

    createControl(): F {
        return new this.constructor(this.parser, this.shape.clone());
    }
}