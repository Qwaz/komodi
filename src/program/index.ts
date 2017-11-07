import * as _ from "lodash";
import {Coordinate} from "../common";
import {BlockGraphic, ExpressionToken, PlaceholderToken, Token, UserInputToken} from "../graphic/index";
import {KomodiType, typeFromString} from "../type";
import {BlockDefinition, blockDefinitionParser} from "./definition_parser";
import {commandNodeDrawer, functionNodeDrawer, signalNodeDrawer} from "../graphic/node_drawer";
import {boxScopeDrawer, lineScopeDrawer} from "../graphic/scope_drawer";

interface FreeBlock {
    coordinate: Coordinate;
    block: Block;
}

export class Program {
    constructor(readonly freeBlocks: FreeBlock[]) {
    }
}

interface BlockDefinitionBase {
    id: string;
    definition: string;
    scopeNames?: string[];
}

function parseBlockDefinition(definitionBase: BlockDefinitionBase): BlockDefinition {
    let parsed = blockDefinitionParser.parse(definitionBase.definition);
    let tokens = _.map(parsed.tokens, (token: any) => {
        switch (token.tokenType) {
            case "placeholder":
                return new PlaceholderToken(token.value);
            case "expression":
                return new ExpressionToken(token.identifier, typeFromString(token.type));
            case "user_input":
                return new UserInputToken(token.identifier, typeFromString(token.type));
            default:
                throw new Error("Unknown token type returned from the parser");
        }
    });

    return {
        id: definitionBase.id,
        definition: definitionBase.definition,
        tokens: tokens,
        returnType: parsed.returnType ? typeFromString(parsed.returnType) : KomodiType.empty,
        argumentNames: _.filter(tokens, <(x: Token) => x is ExpressionToken>((token) => token instanceof ExpressionToken)).map((token) => token.identifier),
        scopeNames: definitionBase.scopeNames ? definitionBase.scopeNames : []
    }
}

interface ArgumentAttach {
    attachType: "argument";

    target: Block;
    argumentName: string;
}

interface ScopeAttach {
    attachType: "scope";

    target: Block;
    scopeName: string;
    scopeIndex: number;
}

type AttachInfo = ArgumentAttach | ScopeAttach;

export abstract class Block {
    // parental attach information
    attachInfo: AttachInfo | null = null;
    protected _graphic: BlockGraphic;

    constructor(readonly definition: BlockDefinition) {
        this.initGraphic();
    }

    protected abstract initGraphic(): void;

    initFinished(): void {
        this.updateGraphic();
    }

    get graphic(): BlockGraphic {
        return this._graphic;
    }

    getArgument(argumentName: string): Expression | null {
        if (_.includes(this.definition.argumentNames, argumentName)) {
            return (<any>this)[argumentName];
        }
        throw new Error(`Argument ${argumentName} does not exist`);
    }

    getScope(scopeName: string): Scope {
        if (_.includes(this.definition.scopeNames, scopeName)) {
            return (<any>this)[scopeName];
        }
        throw new Error(`Scope ${scopeName} does not exist`);
    }

    attachBlock(attachInfo: AttachInfo, block: Block) {
        if (attachInfo.target != this) {
            throw new Error("Invalid attach target");
        }

        switch (attachInfo.attachType) {
            case "argument":
                if (block instanceof Expression == false)
                    throw new Error("Attach value should be an Expression");
                if (this.getArgument(attachInfo.argumentName) != null) {
                    throw new Error(`Argument ${attachInfo.argumentName} is not empty`);
                }

                block.attachInfo = attachInfo;
                (<any>this)[attachInfo.argumentName] = block;
                break;
            case "scope":
                if (!(block instanceof Command)) {
                    throw new Error("Attach value should be a Command");
                }

                let scope = this.getScope(attachInfo.scopeName);
                if (attachInfo.scopeIndex < 0 || scope.length < attachInfo.scopeIndex) {
                    throw new Error("Invalid scope index");
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
            throw new Error("Invalid detach target");
        }
        if (attachInfo.target != this) {
            throw new Error("Invalid detach parent");
        }

        switch (attachInfo.attachType) {
            case "argument":
                if (this.getArgument(attachInfo.argumentName) != block) {
                    throw new Error("Inconsistent attach");
                }

                block.attachInfo = null;
                (<any>this)[attachInfo.argumentName] = null;
                break;
            case "scope":
                let scope = this.getScope(attachInfo.scopeName);
                if (scope[attachInfo.scopeIndex] != block) {
                    throw new Error("Inconsistent attach");
                }

                for (let i = attachInfo.scopeIndex+1; i < scope.length; i++) {
                    (<ScopeAttach>scope[i].attachInfo).scopeIndex--;
                }
                block.attachInfo = null;
                scope.splice(attachInfo.scopeIndex, 1);
                break;
        }

        this.graphic.removeChild(block.graphic);
    }

    updateGraphic() {
        let now: Block = this;
        while (true) {
            now.graphic.update(now.definition, argumentGraphicsGenerator(now), scopeGraphicsGenerator(now));
            if (now.attachInfo == null)
                break;
            now = now.attachInfo.target;
        }
    }
}

export abstract class Expression extends Block {
    constructor(defBase: BlockDefinitionBase) {
        let def = parseBlockDefinition(defBase);
        if (def.returnType == KomodiType.empty)
            throw new Error(`Error in definition "${def.definition}": Expression must have a return type`);

        super(def);
    }

    protected initGraphic() {
        this._graphic = new BlockGraphic(functionNodeDrawer, lineScopeDrawer);
    }
}

export abstract class Command extends Block {
    constructor(defBase: BlockDefinitionBase) {
        let def = parseBlockDefinition(defBase);
        if (def.returnType != KomodiType.empty)
            throw new Error(`Error in definition "${def.definition}": Command must not have a return type`);

        super(def);
    }

    protected initGraphic() {
        this._graphic = new BlockGraphic(commandNodeDrawer, boxScopeDrawer);
    }
}

export abstract class Signal extends Block {
    constructor(defBase: BlockDefinitionBase) {
        let def = parseBlockDefinition(defBase);
        if (def.returnType != KomodiType.empty)
            throw new Error(`Error in definition "${def.definition}": Signal must not have a return type`);

        super(def);
    }

    protected initGraphic() {
        this._graphic = new BlockGraphic(signalNodeDrawer, lineScopeDrawer);
    }
}

export type Scope = Command[];

export function argumentGraphicsGenerator(block: Block) {
    return function *() {
        for (let argumentName of block.definition.argumentNames) {
            let argumentBlock = block.getArgument(argumentName);
            yield argumentBlock == null ? null : argumentBlock.graphic;
        }
    };
}

export function scopeGraphicsGenerator(block: Block) {
    return function *() {
        for (let scopeName of block.definition.scopeNames) {
            let scopeBlocks = block.getScope(scopeName)!;
            debugger;
            yield (function *() {
                for (let block of scopeBlocks) {
                    yield block.graphic;
                }
            })();
        }
    };
}
