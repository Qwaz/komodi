import {BlockClass, Expression} from "../index";
import {defaultNodeDrawer} from "../../graphic/node_drawer";
import {parseBlockDefinition} from "../definition_parser";
import {lineScopeDrawer} from "../../graphic/scope_drawer";

export class ExpConstantInteger extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpConstantInteger.name, definition: "{num: int}: int",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => children.num
    });

    num: number;

    constructor () {
        super(ExpConstantInteger.definition);
    }
}

export class ExpIntToString extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpIntToString.name, definition: "toString [num: int]: string",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `""+(${children.num})`
    });

    num: Expression | null = null;

    constructor () {
        super(ExpIntToString.definition);
    }
}

export class ExpCompareInteger extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpCompareInteger.name, definition: "[num1: int] == [num2: int]: bool",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.num1}) == (${children.num2})`
    });

    num1: Expression | null = null;
    num2: Expression | null = null;

    constructor () {
        super(ExpCompareInteger.definition);
    }
}

export class ExpLtInteger extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpLtInteger.name, definition: "[num1: int] < [num2: int]: bool",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.num1}) < (${children.num2})`
    });

    num1: Expression | null = null;
    num2: Expression | null = null;

    constructor () {
        super(ExpLtInteger.definition);
    }
}

export class ExpAddInteger extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpAddInteger.name, definition: "[num1: int] + [num2: int]: int",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.num1}) + (${children.num2})`
    });

    num1: Expression | null = null;
    num2: Expression | null = null;

    constructor () {
        super(ExpAddInteger.definition);
    }
}

export class ExpMinusInteger extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpMinusInteger.name, definition: "[num1: int] - [num2: int]: int",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.num1}) - (${children.num2})`
    });

    num1: Expression | null = null;
    num2: Expression | null = null;

    constructor () {
        super(ExpMinusInteger.definition);
    }
}

export const blockList: BlockClass[] = [
    ExpConstantInteger, ExpIntToString, ExpCompareInteger, ExpLtInteger, ExpAddInteger, ExpMinusInteger
];
