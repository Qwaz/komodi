export enum KomodiType {
    string,
    bool,
    int,
    empty,
}

export function typeFromString(str: string): KomodiType {
    switch (str) {
        case "string":
            return KomodiType.string;
        case "bool":
            return KomodiType.bool;
        case "int":
            return KomodiType.int;
        default:
            throw new Error(`Unknown type string: ${str}`);
    }
}

export function typeToColor(type: KomodiType) {
    switch (type) {
        case KomodiType.string:
            return 0xF1A9A0;
        case KomodiType.bool:
            return 0xDCC6E0;
        case KomodiType.int:
            return 0xC5EFF7;
        case KomodiType.empty:
            return 0xFFFFFF;
    }
}
