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
import {uuidToJsIdentifier, uuidv4} from "../../common/utils";
import {KomodiType} from "../../type";
import {KomodiContext} from "../../context";
import {checkScopeTree} from "../validator/validating_functions";

export class DefinitionStart extends Definition {
    static readonly definition = parseBlockDefinition({
        id: DefinitionStart.name, definition: "start", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children) => `(function () {${children.body}})();`
    });

    body: Scope = [];

    constructor() {
        super(DefinitionStart.definition);
    }
}

export class DefinitionFunction extends Definition {
    static readonly definition = parseBlockDefinition({
        id: DefinitionFunction.name, definition: "{scope: scope} function {define: definition}", scopeNames: ["body"],
        nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer,
        execution: (children, block) => {
            let functionId = uuidToJsIdentifier(block.exportInfo[0].blockClass.definition.id);

            let argumentString = '';
            for (let argumentName of block.exportInfo[0].blockClass.definition.argumentNames) {
                if (argumentString == '') {
                    argumentString = argumentName;
                } else {
                    argumentString += `, ${argumentName}`;
                }
            }

            return `function ${functionId}(${argumentString}) {${children.body}}`;
        }
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
            this.exportInfo.forEach((data) => {
                this.context.module.deleteExport(this.moduleName, data.scope, data.blockClass);
            });
            this.exportInfo[0].scope = parseScopeString(value);
            this.exportInfo.forEach((data) => {
                this.context.module.addExport(this.moduleName, data.scope, data.blockClass);
            });
        }
    }

    get define() {
        return this._define;
    }

    set define(value: string) {
        this._define = value;
        if (this.initialized) {
            this.updateExport();
        }
    }

    private updateExport() {
        this.clearExport();

        // Function
        let scope = parseScopeString(this.scope);
        let definition = parseBlockDefinition({
            id: uuidv4(), definition: this.define,
            nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
            execution: (children, block) => {
                let functionId = uuidToJsIdentifier(block.definition.id);

                let argumentString = '';
                for (let argumentName of block.definition.argumentNames) {
                    if (argumentString == '') {
                        argumentString = `(${children[argumentName]})`;
                    } else {
                        argumentString += `, (${children[argumentName]})`;
                    }
                }

                let callString = `${functionId}(${argumentString})`;
                if (block.definition.returnType == KomodiType.empty) {
                    callString += ';';
                }
                return callString;
            }
        });
        if (definition.returnType == KomodiType.empty) {
            this.addExport(scope, createAnonymousCommand(definition));
        } else {
            this.addExport(scope, createAnonymousExpression(definition));
        }

        // Argument
        definition.tokens.forEach((token) => {
            if (token instanceof ExpressionToken) {
                let argumentDefinition = parseBlockDefinition({
                    id: uuidv4(), definition: `${token.identifier}: ${token.type}`,
                    validatorPre: [checkScopeTree(this)],
                    nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
                    execution: () => `${token.identifier}`
                });

                this.addExport(ExportScope.INTERNAL, createAnonymousExpression(argumentDefinition));
            }
        });

        // Return
        if (definition.returnType != KomodiType.empty) {
            let returnBlockDefinition = parseBlockDefinition({
                id: uuidv4(), definition: `return [result: ${definition.returnType}]`,
                validatorPre: [checkScopeTree(this)],
                nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer,
                execution: (children) => `return (${children.result});`
            });
            this.addExport(ExportScope.INTERNAL, createAnonymousCommand(returnBlockDefinition));
        }
    }

    init(context: KomodiContext, moduleName: string) {
        super.init(context, moduleName);
        this.updateExport();
    }
}

export class CmdIfElse extends Command {
    static readonly definition = parseBlockDefinition({
        id: CmdIfElse.name, definition: "if [condition: bool]", scopeNames: ["ifBranch", "elseBranch"],
        nodeDrawer: defaultNodeDrawer, scopeDrawer: boxScopeDrawer,
        execution: (children) => `if (${children.condition}) {${children.ifBranch}} else {${children.elseBranch}}`
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
