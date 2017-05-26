import {Control} from "../controls/Control";
import {Shape} from "../shape/shape";
import {Parser} from "../parser/Parser";
import {ControlFactory} from "./ControlFactory";
import {ParameterGenerator} from "../ui/ParameterGenerator";

export interface ControlParameterInfo {
    name: string,
    initial: any,
    options?: any[],
}

export class ParameterFactory<F extends Control, P extends Parser, S extends Shape> extends ControlFactory<F, P, S> {
    readonly data: any;

    private _parser: P;
    private _shape: S;

    constructor(
        constructor: {new (parser: P, shape: S): F},
        readonly controlParameterInfo: ControlParameterInfo[],
        private func: (data: any) => {parser: P, shape: S}
    ) {
        super(constructor);

        this.data = {};
        for (let parameter of controlParameterInfo) {
            this.data[parameter.name] = parameter.initial;
        }

        this.update();
    }

    get generator() {
        return ParameterGenerator;
    }

    get parser(): P {
        return this._parser;
    }

    get shape(): S {
        return this._shape;
    }

    update() {
        let result = this.func(this.data);
        this._parser = result.parser;
        this._shape = result.shape;
    }

    createControl(): F {
        return new this.constructor(this._parser, this._shape.clone());
    }
}