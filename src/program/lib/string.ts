import {BlockClass, Expression} from "../index";
import {defaultNodeDrawer} from "../../graphic/node_drawer";
import {lineScopeDrawer} from "../../graphic/scope_drawer";
import {parseBlockDefinition} from "../definition_parser";

export class ExpConstantString extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpConstantString.name, definition: "{str: string}: string",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `"${children.str}"`
    });

    str: string;

    constructor () {
        super(ExpConstantString.definition);
    }
}

export class ExpConcatString extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpConcatString.name, definition: "concat [str1: string] + [str2: string]: string",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.str1})+(${children.str2})`
    });

    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super(ExpConcatString.definition);
    }
}

export class ExpCompareString extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpCompareString.name, definition: "is same [str1: string], [str2: string]: bool",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(${children.str1}) == (${children.str2})`
    });

    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super(ExpCompareString.definition);
    }
}

export const blockList: BlockClass[] = [
    ExpConstantString, ExpConcatString, ExpCompareString
];
