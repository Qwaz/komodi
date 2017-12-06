import {BlockClass, Command, Expression} from "../index";
import {commandNodeDrawer, expressionNodeDrawer} from "../../graphic/node_drawer";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {parseBlockDefinition} from "../definition_parser";

export class ExpReadLine extends Expression {
    static definition = parseBlockDefinition({
        id: ExpReadLine.name, definition: "read line: string",
        nodeDrawer: expressionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    constructor () {
        super(ExpReadLine.definition);
    }
}

export class CmdPrintLine extends Command {
    static definition = parseBlockDefinition({
        id: CmdPrintLine.name, definition: "print line [str: string]", scopeNames: [],
        nodeDrawer: commandNodeDrawer, scopeDrawer: boxScopeDrawer
    });

    str: Expression | null = null;

    constructor() {
        super(CmdPrintLine.definition);
    }
}

export let blockList: BlockClass[] = [
    ExpReadLine, CmdPrintLine
];
