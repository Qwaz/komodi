import * as _ from "lodash";

abstract class TypeBase {
    abstract get primitive(): boolean;

    equals(typeInfo: TypeInfo): boolean {
        if (this.primitive) {
            return typeInfo instanceof this.constructor;
        }
        return false;
    };
}

export class TNumber extends TypeBase {
    readonly name: "integer" = "integer";
    readonly primitive = true;
}

export class TString extends TypeBase {
    readonly name: "string" = "string";
    readonly primitive = true;
}

export class TBoolean extends TypeBase {
    readonly name: "boolean" = "boolean";
    readonly primitive = true;
}

export class TVoid extends TypeBase {
    readonly name: "void" = "void";
    readonly primitive = true;
}

export class TFunction extends TypeBase {
    readonly name: "Function" = "Function";
    readonly primitive = false;

    constructor(public args: TypeInfo[], public returns: TypeInfo) {
        super();
    }

    equals(typeInfo: TypeInfo): boolean {
        if (typeInfo instanceof TFunction) {
            if (typeInfo.args.length == this.args.length) {
                return _.every(typeInfo.args, (argType, i) => this.args[i].equals(argType))
                    && this.returns.equals(typeInfo.returns);
            }
        }
        return false;
    }
}

export type TypeInfo = TNumber | TString | TBoolean | TVoid | TFunction;

export function typeInfoToColor(typeInfo: TypeInfo): number {
    switch (typeInfo.name) {
        case "integer":
            return 0xC5CAE9;
        case "string":
            return 0xE1BEE7;
        case "boolean":
            return 0xBCAAA4;
        case "void":
            return 0xe8e8e8;
        case "Function":
            return 0;
    }
}