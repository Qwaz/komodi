import {Block, Declaration, FlowItemFactory, Signal} from "./controls";
import {SignalShape} from "../shape/SignalShape";
import {BlockShape} from "../shape/shape";
import {ConditionBlockShape} from "../shape/ConditionBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";
import {FunctionShape} from "../shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "../type/type";
import {Parser} from "../parser/parser";
import {SplitScope} from "../scope/SplitScope";
import {LoopScope} from "../scope/LoopScope";

class IfBlock extends Block {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new SplitScope(this, 2));
    }
}

class WhileBlock extends Block {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new LoopScope(this));
    }
}

export let startSignalFactory = new FlowItemFactory(
    Signal,
    new Parser(`(function () {$1})()`),
    new SignalShape('Start')
);

export let ifBlockFactory = new FlowItemFactory(
    IfBlock,
    new Parser(`if (@1) {$1} else {$2}`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new FlowItemFactory(
    WhileBlock,
    new Parser(`while (@1) {$1}`),
    new ConditionBlockShape('while')
);

export let declarationFactory = new FlowItemFactory(
    Declaration,
    new Parser(`{let local = (@1); $1}`),  // TODO: fix variable handling
    new DeclarationShape(0xC8E6C9)
);

// TODO: parse type info and labels at once by jison
export let intBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`parseInt(prompt("Please Enter a number"))`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "User Input"
    )
);

export let randBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`Math.floor(Math.random()*5)+1`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "rand 1~5"
    )
);

export let tenBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`10`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "10"
    )
);

export let multiplyBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`(@1)*2`),
    new FunctionShape(
        new TFunction([new TNumber()], new TNumber()),
        "(num) x2"
    )
);

export let correctBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`"correct"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"correct\""
    )
);

export let wrongBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`"wrong"`),
    new FunctionShape(
        new TFunction([], new TString()),
        "\"wrong\""
    )
);

export let printStingBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`alert(@1)`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let compareBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`(@1) !== (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)!=(num2)"
    )
);

export let lessThanBlockFactory = new FlowItemFactory(
    Block,
    new Parser(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);