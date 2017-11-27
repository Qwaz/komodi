import {Expression, parseBlockDefinition} from "../index";
import {BlockClass} from "./index";
import {functionNodeDrawer} from "../../graphic/node_drawer";
import {lineScopeDrawer} from "../../graphic/scope_drawer";

export class ExpConstantString extends Expression {
    static definition = parseBlockDefinition({
        id: ExpConstantString.name, definition: "{str: string}: string",
        nodeDrawer: functionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    constructor () {
        super(ExpConstantString.definition);
        this.initFinished();
    }
}

export class ExpConcatString extends Expression {
    static definition = parseBlockDefinition({
        id: ExpConcatString.name, definition: "concat [str1: string] + [str2: string]: string",
        nodeDrawer: functionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super(ExpConcatString.definition);
        this.initFinished();
    }
}

export class ExpCompareString extends Expression {
    static definition = parseBlockDefinition({
        id: ExpCompareString.name, definition: "is same [str1: string], [str2: string]: bool",
        nodeDrawer: functionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super(ExpCompareString.definition);
        this.initFinished();
    }
}

export let blockList: BlockClass[] = [
    ExpConstantString, ExpConcatString, ExpCompareString
];
