import {Shape} from "../shape/shape";
import {Parser} from "../parser/Parser";
import {Control} from "../controls";

export abstract class ControlFactory<F extends Control, P extends Parser, S extends Shape> {
    constructor(protected constructor: {new (parser: P, shape: S): F}) {
    }

    abstract createControl(): F;

    abstract get generator(): {new (factory: ControlFactory<F, P, S>): void};

    abstract get parser(): P;
    abstract get shape(): S;
}