import {
    addBlockFactory,
    compareBlockFactory,
    declarationFactory,
    divBlockFactory,
    falseBlockFactory,
    forBlockFactory,
    ifBlockFactory,
    intToStringBlockFactory,
    lessThanBlockFactory,
    modBlockFactory,
    multBlockFactory,
    numberBlockFactory,
    printStingBlockFactory,
    randBlockFactory,
    readIntegerBlockFactory,
    readStringBlockFactory,
    repeatBlockFactory,
    startSignalFactory,
    stringBlockFactory,
    subBlockFactory,
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
            forBlockFactory,
            repeatBlockFactory,
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
            addBlockFactory,
            subBlockFactory,
            multBlockFactory,
            divBlockFactory,
            modBlockFactory,
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