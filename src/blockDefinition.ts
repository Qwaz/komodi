import {
    compareBlockFactory,
    correctBlockFactory,
    declarationFactory,
    ifBlockFactory,
    intBlockFactory,
    lessThanBlockFactory,
    multiplyBlockFactory,
    printStingBlockFactory,
    randBlockFactory,
    startSignalFactory,
    tenBlockFactory,
    whileBlockFactory,
    wrongBlockFactory
} from "./ui/blocks";

export const activeBlocks = [
    startSignalFactory,
    ifBlockFactory,
    whileBlockFactory,
    declarationFactory,
    intBlockFactory,
    randBlockFactory,
    tenBlockFactory,
    multiplyBlockFactory,
    correctBlockFactory,
    wrongBlockFactory,
    printStingBlockFactory,
    compareBlockFactory,
    lessThanBlockFactory,
];