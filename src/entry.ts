import {Komodi} from "./Global";
import {NO_STRING_BLOCK_SET, STANDARD_BLOCK_SET} from "./blockSets";
import * as Factories from "./factories";
import * as Controls from "./controls";
import * as Parser from "./parser";
import * as Shape from "./shape";
import * as Type from "./type";

export = {
    setBlocks: Komodi.setBlocks.bind(Komodi),
    initializeDOM: Komodi.initializeDOM.bind(Komodi),
    start: Komodi.start.bind(Komodi),

    runCode: Komodi.runCode.bind(Komodi),
    stopCode: Komodi.stopCode.bind(Komodi),

    blockSets: {
        standardBlockSet: STANDARD_BLOCK_SET,
        noStringBlockSet: NO_STRING_BLOCK_SET,
    },
    io: Komodi.io,
    hook: Komodi.hook,

    factories: Factories,
    controls: Controls,
    parser: Parser,
    shape: Shape,
    type: Type,
};
