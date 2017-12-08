import {BlockClass, Command, Expression} from "../index";
import {defaultNodeDrawer} from "../../graphic/node_drawer";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {parseBlockDefinition} from "../definition_parser";

export class ExpReadLine extends Expression {
    static readonly definition = parseBlockDefinition({
        id: ExpReadLine.name, definition: "read line: string",
        nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    constructor () {
        super(ExpReadLine.definition);
    }
}

export class CmdPrintLine extends Command {
    static readonly definition = parseBlockDefinition({
        id: CmdPrintLine.name, definition: "print line [str: string]", scopeNames: [],
        nodeDrawer: defaultNodeDrawer, scopeDrawer: boxScopeDrawer
    });

    str: Expression | null = null;

    constructor() {
        super(CmdPrintLine.definition);
    }
}

export let blockList: BlockClass[] = [
    ExpReadLine, CmdPrintLine
];
