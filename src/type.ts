export enum KomodiType {
    string = "string",
    bool = "bool",
    int = "int",
    empty = "empty",
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
