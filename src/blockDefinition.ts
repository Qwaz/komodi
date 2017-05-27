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
import {AbsControlFactory} from "./factories/ControlFactory";

export interface SideMenuInfo {
    name: string,
    factories: AbsControlFactory[],
}

export const ACTIVE_BLOCKS: SideMenuInfo[] = [
    {
        name: "Signals",
        factories: [
            startSignalFactory,
        ]
    },
    {
        name: "Flow",
        factories: [
            declarationFactory,
            ifBlockFactory,
            whileBlockFactory,
        ]
    },
    {
        name: "Logic",
        factories: [
            trueBlockFactory,
            compareBlockFactory,
            lessThanBlockFactory,
        ]
    },
    {
        name: "Number",
        factories: [
            inputBlockFactory,
            randBlockFactory,
            numberBlockFactory,
        ]
    },
    {
        name: "String",
        factories: [
            intToStringBlockFactory,
            stringBlockFactory,
            printStingBlockFactory,
        ]
    },
];