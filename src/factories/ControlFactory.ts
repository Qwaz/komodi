import * as PIXI from "pixi.js";
import {Shape} from "../shape/shape";
import {Parser} from "../parser";
import {Control} from "../controls";

export interface AbsGenerator extends PIXI.Container {
}

export interface AbsGeneratorConstructor {
    new (factory: AbsControlFactory): PIXI.Container;
}

export interface AbsControlFactory {
    createControl(): Control;
    generator: AbsGeneratorConstructor;
}

export abstract class ControlFactory<F extends Control, P extends Parser, S extends Shape> {
    constructor(protected constructor: {new (parser: P, shape: S): F}) {
    }

    abstract createControl(): F;

    abstract get generator(): {new (factory: ControlFactory<F, P, S>): PIXI.Container};

    abstract get parser(): P;
    abstract get shape(): S;
}