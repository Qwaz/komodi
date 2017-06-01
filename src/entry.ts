import {Komodi} from "./Global";
import {STANDARD_BLOCK_SET} from "./blockSets";

export = {
    setBlocks: Komodi.setBlocks.bind(Komodi),
    initializeDOM: Komodi.initializeDOM.bind(Komodi),
    start: Komodi.start.bind(Komodi),
    blockSets: {
        standardBlockSet: STANDARD_BLOCK_SET
    },
    io: {
        readInt: () => parseInt(prompt("Please enter a number") || "0"),
        readString: () => prompt("Please enter a string"),
    },
};