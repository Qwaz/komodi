import {Block, Declaration, FlowItemFactory, Signal, SimpleBlock} from "./flow";
import {SignalShape} from "../shape/SignalShape";
import {loopStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";
import {ConditionBlockShape} from "../shape/ConditionBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "../type/type";
import {Logic} from "../logic/logic";
import {Global} from "../entry";

class IfBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 2, splitJoinStrategy);
    }
}

class WhileBlock extends Block {
    constructor(logic: Logic, shape: BlockShape) {
        super(logic, shape, 1, loopStrategy);

        Global.flowController.update(this);
    }
}

export let startSignalFactory = new FlowItemFactory(
    Signal,
    new Logic(`(function () {$1})()`),
    new SignalShape('Start')
);

export let ifBlockFactory = new FlowItemFactory(
    IfBlock,
    new Logic(`if (@1) {$1} else {$2}`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new FlowItemFactory(
    WhileBlock,
    new Logic(`while (@1) {$1}`),
    new ConditionBlockShape('while')
);

export let declarationFactory = new FlowItemFactory(
    Declaration,
    new Logic(`{let local = (@1); $1}`),  // TODO: fix variable handling
    new DeclarationShape(0xC8E6C9)
);

// TODO: parse type info and labels at once by jison
export let intBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`parseInt(prompt("Please Enter a number"))`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "User Input"
    )
);

export let randBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`Math.floor(Math.random()*5)+1`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "rand 1~5"
    )
);

export let tenBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`10`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "10"
    )
);

export let multiplyBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`(@1)*2`),
    new FunctionShape(
        new TFunction([new TNumber()], new TNumber()),
        "(num) x2"
    )
);

export let correctBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`"correct"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"correct\""
    )
);

export let wrongBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`"wrong"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"wrong\""
    )
);

export let printStingBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`alert(@1)`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let compareBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`(@1) !== (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)!=(num2)"
    )
);

export let lessThanBlockFactory = new FlowItemFactory(
    SimpleBlock,
    new Logic(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);