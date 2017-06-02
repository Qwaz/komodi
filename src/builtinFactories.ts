import {Block, Declaration, FlowBlock, Signal} from "./controls";
import {SignalShape} from "./shape/SignalShape";
import {BlockShape} from "./shape/shape";
import {ConditionBlockShape} from "./shape/ConditionBlockShape";
import {DeclarationShape} from "./shape/DeclarationShape";
import {FunctionShape} from "./shape/FunctionShape";
import {TBoolean, TFunction, TNumber, TString, TVoid} from "./type";
import {SplitScope} from "./scope/SplitScope";
import {LoopScope} from "./scope/LoopScope";
import {SimpleFactory} from "./factories/SimpleFactory";
import {DeclarationParser, Parser, PatternParser} from "./parser/Parser";
import {ParameterFactory} from "./factories/ParameterFactory";

class IfBlock extends FlowBlock {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new SplitScope(this, 2));
    }
}

class WhileBlock extends FlowBlock {
    constructor(logic: Parser, shape: BlockShape) {
        super(logic, shape);

        this.setScope(new LoopScope(this));
    }
}

export let startSignalFactory = new SimpleFactory(
    Signal,
    new PatternParser(`(function () {$1})()`),
    new SignalShape('Start')
);

export let ifBlockFactory = new SimpleFactory(
    IfBlock,
    new PatternParser(`if (@1) {$1} else {$2}`),
    new ConditionBlockShape('if')
);

export let whileBlockFactory = new SimpleFactory(
    WhileBlock,
    new PatternParser(`while (@1) {$1}`),
    new ConditionBlockShape('while')
);

export let trueBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`true`),
    new FunctionShape(
        new TFunction([], new TBoolean()),
        "true"
    )
);

export let falseBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`false`),
    new FunctionShape(
        new TFunction([], new TBoolean()),
        "false"
    )
);

export let declarationFactory = new ParameterFactory(
    Declaration,
    [{name: "variable", initial: 'var'}],
    (data: any) => {
        return {
            parser: new DeclarationParser(),
            shape: new DeclarationShape(0xFFFFFF, data.variable)
        }
    }
);

// TODO: parse type info and labels at once by jison
export let readIntegerBlockFactory = new SimpleFactory(
    Block,
    // TODO: Code generation should not depend on global Komodi object
    new PatternParser(`Komodi.io.readInt()`),
    new FunctionShape(
        new TFunction([], new TNumber()),
        "Read Integer"
    )
);

export let readStringBlockFactory = new SimpleFactory(
    Block,
    // TODO: Code generation should not depend on global Komodi object
    new PatternParser(`Komodi.io.readString()`),
    new FunctionShape(
        new TFunction([], new TString()),
        "Read String"
    )
);

export let randBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`Math.floor(Math.random()*((@2)-(@1)+1))+(@1)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TNumber()),
        "random (min)~(max)"
    )
);

export let numberBlockFactory = new ParameterFactory(
    Block,
    [{name: "value", initial: 10}],
    (data: any) => {
        return {
            parser: new PatternParser(`${data.value}`),
            shape: new FunctionShape(
                new TFunction([], new TNumber()),
                `${data.value}`
            )
        }
    }
);

export let stringBlockFactory = new ParameterFactory(
    Block,
    [{name: "value", initial: "string"}],
    (data: any) => {
        return {
            // TODO: quote the given string
            parser: new PatternParser(`"${data.value}"`),
            shape: new FunctionShape(
                new TFunction([], new TString()),
                `"${data.value}"`
            )
        }
    }
);

export let intToStringBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1).toString()`),
    new FunctionShape(
        new TFunction([new TNumber()], new TString()),
        "toString (num)"
    )
);

export let printStingBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`alert(@1)`),
    new FunctionShape(
        new TFunction([new TString()], new TVoid()),
        "print(string)"
    )
);

export let compareBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1) === (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)==(num2)"
    )
);

export let lessThanBlockFactory = new SimpleFactory(
    Block,
    new PatternParser(`(@1) < (@2)`),
    new FunctionShape(
        new TFunction([new TNumber(), new TNumber()], new TBoolean()),
        "(num1)<(num2)"
    )
);