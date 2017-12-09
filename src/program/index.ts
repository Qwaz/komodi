import * as _ from "lodash";
import {BlockGraphic} from "../graphic";
import {KomodiType} from "../type";
import {BlockDefinition, UserInputToken} from "./definition_parser";
import {AttachInfo, ScopeAttach} from "./attacher";
import {ExportScope} from "./module";
import {KomodiContext} from "../context";

export interface BlockClass {
    new (): Block;
    readonly definition: BlockDefinition;
}

export abstract class BlockBase {
    graphic: BlockGraphic;

    constructor(readonly definition: BlockDefinition) {
    }

    abstract getArgument(argumentName: string): Expression | null;

    abstract getScope(scopeName: string): Scope;

    abstract getInput(inputName: string): string;
}

export class VirtualBlock extends BlockBase {
    constructor(blockClass: BlockClass) {
        super(blockClass.definition);
    }

    getArgument(argumentName: string): Expression | null {
        if (_.includes(this.definition.argumentNames, argumentName)) {
            return null;
        }
        throw new Error(`getArgument failed: argument ${argumentName} does not exist`);
    };

    getScope(scopeName: string): Scope {
        if (_.includes(this.definition.scopeNames, scopeName)) {
            return [];
        }
        throw new Error(`getScope failed: ${scopeName} does not exist`);
    }

    getInput(inputName: string): string {
        if (_.includes(this.definition.inputNames, inputName)) {
            let token = <UserInputToken>this.definition.tokens.find((token) => {
                return token.kind == "user_input" && token.identifier == inputName;
            });
            return token.validator.defaultValue;
        }
        throw new Error(`getInput failed: ${inputName} does not exist`);
    }
}

export abstract class Block extends BlockBase {
    // parental attach information
    attachInfo: AttachInfo | null = null;

    private _initialized = false;

    context: KomodiContext;
    moduleName: string;
    exportInfo: {scope: ExportScope, blockClass: BlockClass}[] = [];

    constructor(definition: BlockDefinition) {
        super(definition);

        this.graphic = new BlockGraphic(this);
    }

    get initialized() {
        return this._initialized;
    }

    getArgument(argumentName: string): Expression | null {
        if (_.includes(this.definition.argumentNames, argumentName)) {
            return (<any>this)[argumentName];
        }
        throw new Error(`getArgument failed: argument ${argumentName} does not exist`);
    }

    getScope(scopeName: string): Scope {
        if (_.includes(this.definition.scopeNames, scopeName)) {
            return (<any>this)[scopeName];
        }
        throw new Error(`getScope failed: ${scopeName} does not exist`);
    }

    getInput(inputName: string): string {
        if (_.includes(this.definition.inputNames, inputName)) {
            return (<any>this)[inputName];
        }
        throw new Error(`getInput failed: ${inputName} does not exist`);
    }

    init(context: KomodiContext, moduleName: string) {
        this.context = context;
        this.moduleName = moduleName;
        this.definition.tokens.forEach((token) => {
            if (token instanceof UserInputToken) {
                (<any>this)[token.identifier] = token.validator.defaultValue;
            }
        });
        this.context.registerBlock(this);
        this._initialized = true;

        this.updateGraphic();
    }

    // export related functions
    addExport(scope: ExportScope, blockClass: BlockClass) {
        this.exportInfo.push({
            scope: scope,
            blockClass: blockClass
        });
        this.context.module.addExport(this.moduleName, scope, blockClass);
    }

    clearExport() {
        this.exportInfo.forEach((data) => {
            this.context.module.deleteExport(this.moduleName, data.scope, data.blockClass);
        });

        this.exportInfo.length = 0;
    }

    getExportId() {
        return this.exportInfo.map(
            (data) =>data.blockClass.definition.id
        );
    }

    setExportId(idArray: string[]) {
        this.exportInfo.forEach((data, i) => {
            this.context.module.deleteExport(this.moduleName, data.scope, data.blockClass);
            data.blockClass.definition.id = idArray[i];
            this.context.module.addExport(this.moduleName, data.scope, data.blockClass);
        });
    }

    // attach & detach
    attachBlock(attachInfo: AttachInfo, block: Block) {
        if (attachInfo.target != this) {
            throw new Error("attachBlock failed: invalid attach target");
        }

        switch (attachInfo.attachType) {
            case "argument":
                if (block instanceof Expression == false)
                    throw new Error("attachBlock failed: attach value should be an Expression");
                if (this.getArgument(attachInfo.argumentName) != null) {
                    throw new Error(`attachBlock failed: argument ${attachInfo.argumentName} is not empty`);
                }

                block.attachInfo = attachInfo;
                (<any>this)[attachInfo.argumentName] = block;
                break;
            case "scope":
                if (!(block instanceof Command)) {
                    throw new Error("attachBlock failed: attach value should be a Command");
                }

                let scope = this.getScope(attachInfo.scopeName);
                if (attachInfo.scopeIndex < 0 || scope.length < attachInfo.scopeIndex) {
                    throw new Error("attachBlock failed: invalid scope index");
                }

                for (let i = attachInfo.scopeIndex; i < scope.length; i++) {
                    (<ScopeAttach>scope[i].attachInfo).scopeIndex++;
                }
                block.attachInfo = attachInfo;
                scope.splice(attachInfo.scopeIndex, 0, block);
                break;
        }

        this.graphic.addChild(block.graphic);
        this.updateGraphic();
    }

    detachBlock(block: Block) {
        let attachInfo = block.attachInfo;
        if (attachInfo == null) {
            throw new Error("detachBlock failed: target is not attached");
        }
        if (attachInfo.target != this) {
            throw new Error("detachBlock failed: wrong parent");
        }

        switch (attachInfo.attachType) {
            case "argument":
                if (this.getArgument(attachInfo.argumentName) != block) {
                    throw new Error("detachBlock failed: inconsistent attach");
                }

                block.attachInfo = null;
                (<any>this)[attachInfo.argumentName] = null;
                break;
            case "scope":
                let scope = this.getScope(attachInfo.scopeName);
                if (scope[attachInfo.scopeIndex] != block) {
                    throw new Error("detachBlock failed: inconsistent attach");
                }

                for (let i = attachInfo.scopeIndex+1; i < scope.length; i++) {
                    (<ScopeAttach>scope[i].attachInfo).scopeIndex--;
                }
                block.attachInfo = null;
                scope.splice(attachInfo.scopeIndex, 1);
                break;
        }

        this.graphic.removeChild(block.graphic);
        this.updateGraphic();
    }

    updateGraphic() {
        let now: Block = this;
        while (true) {
            now.graphic.update();
            if (now.attachInfo == null)
                break;
            now = now.attachInfo.target;
        }
    }

    destroy() {
        for (let argumentName of this.definition.argumentNames) {
            let argumentBlock = this.getArgument(argumentName);
            if (argumentBlock) {
                argumentBlock.destroy();
            }
        }

        for (let scopeName of this.definition.scopeNames) {
            for (let scopeBlock of this.getScope(scopeName)) {
                scopeBlock.destroy();
            }
        }
        this.clearExport();

        this.graphic.destroy();
        this.context.unregisterBlock(this);
    }
}

export abstract class Expression extends Block {
    constructor(def: BlockDefinition) {
        if (def.returnType == KomodiType.empty)
            throw new Error("new Expression failed: Expression must have a return type");

        super(def);
    }
}

export abstract class Command extends Block {
    constructor(def: BlockDefinition) {
        if (def.returnType != KomodiType.empty)
            throw new Error("new Command failed: Command must not have a return type");

        super(def);
    }
}

export abstract class Definition extends Block {
    constructor(def: BlockDefinition) {
        if (def.returnType != KomodiType.empty)
            throw new Error("new Definition failed: Definition must not have a return type");

        super(def);
    }
}

export function createAnonymousCommand(definition: BlockDefinition) {
    return class extends Command {
        static readonly definition = definition;
        constructor() {
            super(definition);
        }
    }
}

export function createAnonymousExpression(definition: BlockDefinition) {
    return class extends Expression {
        static readonly definition = definition;
        constructor() {
            super(definition);
        }
    }
}

export type Scope = Command[];
