import {
    compareBlockFactory,
    declarationFactory,
    ifBlockFactory,
    inputBlockFactory,
    intToStringBlockFactory,
    lessThanBlockFactory,
    numberBlockFactory,
    printStingBlockFactory,
    randBlockFactory,
    startSignalFactory,
    stringBlockFactory,
    trueBlockFactory,
    whileBlockFactory
} from "./factories/factories";

export const activeBlocks = [
    startSignalFactory,
    declarationFactory,
    ifBlockFactory,
    whileBlockFactory,
    trueBlockFactory,
    compareBlockFactory,
    lessThanBlockFactory,
    inputBlockFactory,
    randBlockFactory,
    numberBlockFactory,
    intToStringBlockFactory,
    stringBlockFactory,
    printStingBlockFactory,
];