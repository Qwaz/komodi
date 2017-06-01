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
} from "./factories/factories";
import {SideMenuInfo} from "./ui/sideMenu";

export const STANDARD_BLOCK_SET: SideMenuInfo[] = [
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
    {
        name: "String",
        factories: [
            readStringBlockFactory,
            intToStringBlockFactory,
            stringBlockFactory,
            printStingBlockFactory,
        ]
    },
];