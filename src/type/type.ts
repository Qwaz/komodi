export class TNumber {
    readonly name: "integer" = "integer";
    readonly primitive: true = true;
}

export class TString {
    readonly name: "string" = "string";
    readonly primitive: true = true;
}

export class TBoolean {
    readonly name: "boolean" = "boolean";
    readonly primitive: true = true;
}

export class TFunction {
    readonly name: "Function" = "Function";
    readonly primitive: false = false;

    constructor(public args: TypeInfo[], public returns: TypeInfo) {}
}

export type TypeInfo = TNumber | TString | TBoolean | TFunction;

export function typeInfoToColor(typeInfo: TypeInfo): number {
    switch (typeInfo.name) {
        case "integer":
            return 0xC5CAE9;
        case "string":
            return 0xE1BEE7;
        case "boolean":
            return 0xBCAAA4;
        default:
            return 0;
    }
}