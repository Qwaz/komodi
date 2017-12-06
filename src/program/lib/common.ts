import {BlockClass, Command, Definition, Expression, Scope} from "../index";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {commandNodeDrawer, definitionNodeDrawer} from "../../graphic/node_drawer";
import {parseBlockDefinition} from "../definition_parser";

export class DefinitionStart extends Definition {
    static definition = parseBlockDefinition({
        id: DefinitionStart.name, definition: "start", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    body: Scope = [];

    constructor() {
        super(DefinitionStart.definition);
    }
}

export class DefinitionFunction extends Definition {
    static definition = parseBlockDefinition({
        id: DefinitionFunction.name, definition: "{scope: scope} function {define: definition}", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    scope: string;
    define: string;
    body: Scope = [];

    constructor() {
        super(DefinitionFunction.definition);
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
    }
}

export let blockList: BlockClass[] = [
    DefinitionStart, DefinitionFunction, CmdIfElse
];
