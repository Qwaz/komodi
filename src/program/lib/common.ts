import {Command, Expression, parseBlockDefinition, Scope, Signal} from "../index";
import {BlockClass} from "./index";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {commandNodeDrawer, signalNodeDrawer} from "../../graphic/node_drawer";

export class SignalStart extends Signal {
    static definition = parseBlockDefinition({
        id: SignalStart.name, definition: "start", scopeNames: ["body"],
        nodeDrawer: signalNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    body: Scope = [];

    constructor() {
        super(SignalStart.definition);
        this.initFinished();
    }
}

export class CmdIfElse extends Command {
    static definition = parseBlockDefinition({
        id: CmdIfElse.name, definition: "if [condition: bool]", scopeNames: ["ifBranch", "elseBranch"],
        nodeDrawer: commandNodeDrawer, scopeDrawer: boxScopeDrawer
    });

    condition: Expression | null = null;
    ifBranch: Scope = [];
    elseBranch: Scope = [];

    constructor() {
        super(CmdIfElse.definition);
        this.initFinished();
    }
}

export let blockList: BlockClass[] = [
    SignalStart, CmdIfElse
];
