import {BlockClass, Command, Expression} from "../index";
import {defaultNodeDrawer} from "../../graphic/node_drawer";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {parseBlockDefinition} from "../definition_parser";

export class ExpReadString extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpReadString.name, definition: "read string: string",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: () => `window.prompt('Input a string')`
    });

    constructor () {
        super(ExpReadString.definition);
    }
}

export class ExpReadInt extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpReadInt.name, definition: "read integer: int",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: () => `(function () {while(true) {let r = parseInt(window.prompt('Input an integer')); if (!isNaN(r)) return r;}})()`
    });

    constructor () {
        super(ExpReadInt.definition);
    }
}

export class CmdPrintLine extends Command {
    static readonly definition = parseBlockDefinition({
        id: CmdPrintLine.name, definition: "print line [str: string]", scopeNames: [],
        nodeDrawer: defaultNodeDrawer, scopeDrawer: boxScopeDrawer,
        execution: (children) => `window.alert(${children.str});`
    });

    str: Expression | null = null;

    constructor() {
        super(CmdPrintLine.definition);
    }
}

export const blockList: BlockClass[] = [
    ExpReadString, ExpReadInt, CmdPrintLine
];
