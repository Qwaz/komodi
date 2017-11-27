import {Command, Expression, parseBlockDefinition} from "../index";
import {BlockClass} from "./index";
import {commandNodeDrawer, functionNodeDrawer} from "../../graphic/node_drawer";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";

export class ExpReadLine extends Expression {
    static definition = parseBlockDefinition({
        id: ExpReadLine.name, definition: "read line: string",
        nodeDrawer: functionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    constructor () {
        super(ExpReadLine.definition);
        this.initFinished();
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
        this.initFinished();
    }
}

export let blockList: BlockClass[] = [
    ExpReadLine, CmdPrintLine
];
