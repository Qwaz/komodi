import {
    binaryBlockFactory,
    declarationFactory,
    ifBlockFactory,
    intBlockFactory,
    multiplyBlockFactory,
    noBlockFactory,
    printStingBlockFactory,
    startSignalFactory,
    tenBlockFactory,
    whileBlockFactory,
    yesBlockFactory
} from "./ui/blocks";

export const activeBlocks = [
    startSignalFactory,
    ifBlockFactory,
    whileBlockFactory,
    declarationFactory,
    intBlockFactory,
    tenBlockFactory,
    multiplyBlockFactory,
    yesBlockFactory,
    noBlockFactory,
    printStingBlockFactory,
    binaryBlockFactory,
];