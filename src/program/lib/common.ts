import {
    BlockClass,
    Command,
    createAnonymousCommand,
    createAnonymousExpression,
    Definition,
    Expression,
    Scope
} from "../index";
import {boxScopeDrawer, lineScopeDrawer} from "../../graphic/scope_drawer";
import {defaultNodeDrawer, definitionNodeDrawer} from "../../graphic/node_drawer";
import {ExpressionToken, parseBlockDefinition} from "../definition_parser";
import {ExportScope, parseScopeString} from "../module";
import {uuidv4} from "../../common/utils";
import {KomodiType} from "../../type";
import {Komodi} from "../../komodi";

export class DefinitionStart extends Definition {
    static readonly definition = parseBlockDefinition({
        id: DefinitionStart.name, definition: "start", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    body: Scope = [];

    constructor() {
        super(DefinitionStart.definition);
    }
}

export class DefinitionFunction extends Definition {
    static readonly definition = parseBlockDefinition({
        id: DefinitionFunction.name, definition: "{scope: scope} function {define: definition}", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer
    });

    private _scope: string;
    private _define: string;
    body: Scope = [];

    constructor() {
        super(DefinitionFunction.definition);
    }

    get scope() {
        return this._scope;
    }

    set scope(value: string) {
        this._scope = value;
        if (this.initialized) {
            this.updateExport();
        }
    }

    get define() {
        return this._define;
    }

    set define(value: string) {
        this._define = value;
        if (this.initialized) {
            this.exportInfo.forEach((data) => {
                Komodi.module.deleteExport(this.moduleName, data.scope, data.blockClass);
            });
            this.exportInfo[0].scope = parseScopeString(value);
            this.exportInfo.forEach((data) => {
                Komodi.module.addExport(this.moduleName, data.scope, data.blockClass);
            });
        }
    }

    private updateExport() {
        this.clearExport();

        let scope = parseScopeString(this.scope);
        let definition = parseBlockDefinition({
            id: uuidv4(), definition: this.define,
            nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer
        });

        if (definition.returnType == KomodiType.empty) {
            this.addExport(scope, createAnonymousCommand(definition));
        } else {
            this.addExport(scope, createAnonymousExpression(definition));
        }

        definition.tokens.forEach((token) => {
            if (token instanceof ExpressionToken) {
                let argumentDefinition = parseBlockDefinition({
                    id: uuidv4(), definition: `${token.identifier}: ${token.type}`,
                    nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer
                });

                this.addExport(ExportScope.INTERNAL, createAnonymousExpression(argumentDefinition));
            }
        });

        if (definition.returnType != KomodiType.empty) {
            let returnBlockDefinition = parseBlockDefinition({
                id: uuidv4(), definition: `return [result: ${definition.returnType}]`,
                nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer
            });
            this.addExport(ExportScope.INTERNAL, createAnonymousCommand(returnBlockDefinition));
        }
    }

    init(moduleName: string) {
        super.init(moduleName);
        this.updateExport();
    }
}

export class CmdIfElse extends Command {
    static readonly definition = parseBlockDefinition({
        id: CmdIfElse.name, definition: "if [condition: bool]", scopeNames: ["ifBranch", "elseBranch"],
        nodeDrawer: defaultNodeDrawer, scopeDrawer: boxScopeDrawer
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
