import {
    compareBlockFactory,
    declarationFactory,
    falseBlockFactory,
    ifBlockFactory,
    intToStringBlockFactory,
    lessThanBlockFactory,
    numberBlockFactory,
    printStingBlockFactory,
    randBlockFactory,
    readIntegerBlockFactory,
    readStringBlockFactory,
    startSignalFactory,
    stringBlockFactory,
    trueBlockFactory,
    whileBlockFactory
} from "./builtinFactories";
import {SideMenuInfo} from "./ui/sideMenu";

export const NO_STRING_BLOCK_SET: SideMenuInfo[] = [
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
            falseBlockFactory,
            compareBlockFactory,
            lessThanBlockFactory,
        ]
    },
    {
        name: "Number",
        factories: [
            readIntegerBlockFactory,
            randBlockFactory,
            numberBlockFactory,
        ]
    },
];

export const STANDARD_BLOCK_SET: SideMenuInfo[] = NO_STRING_BLOCK_SET.concat([
    {
        name: "String",
        factories: [
            readStringBlockFactory,
            intToStringBlockFactory,
            stringBlockFactory,
            printStingBlockFactory,
        ]
    },
]);