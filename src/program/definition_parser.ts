import peg = require("pegjs");
import * as _ from "lodash";
import {KomodiType, typeFromString} from "../type";
import {NodeDrawer, ScopeDrawer} from "../graphic";
import {lineScopeDrawer} from "../graphic/scope_drawer";
import {definitionNodeDrawer} from "../graphic/node_drawer";

const PARSER_DEFINITION = `
start = tokens: token+ returnType:(":" t:type { return t; })? {
    return {
        tokens: tokens,
        returnType: returnType
    };
}

SPACE = " "*
PLACEHOLDER = $[^:\\[\\]\\{\\}]+
IDENTIFIER = SPACE identifier:$[a-zA-Z0-9_]+ SPACE { return identifier; }

type = SPACE type:("string" / "bool" / "int") SPACE { return type; }
validator = SPACE validator:("string" / "bool" / "int" / "scope" / "definition") SPACE { return validator; }

token
    = str: PLACEHOLDER
        { return {tokenType: "placeholder", value: str}; }
    / "[" identifier:IDENTIFIER ":" type: type "]"
        { return {tokenType: "expression", identifier: identifier, type: type}; }
    / "{" identifier:IDENTIFIER ":" validator: validator "}"
        { return {tokenType: "user_input", identifier: identifier, validator: validator}; }
`;

export const blockDefinitionParser = peg.generate(PARSER_DEFINITION);

export interface UserInputValidator {
    type: KomodiType;
    defaultValue: string;
    updateInput(currentValue: string): string | null;
}

const validatorMap: Map<string, UserInputValidator> = new Map();

function toggle(...args: string[]) {
    return (str: string) => {
        let index = args.indexOf(str);
        return args[(index+1) % args.length];
    };
}

validatorMap.set('string', {
    type: KomodiType.string,
    defaultValue: 'str',
    updateInput: (currentValue: string) => {
        let result = window.prompt('Change string value', currentValue);
        if (result && result.length > 0) {
            return result;
        }
        return null;
    }
});

validatorMap.set('bool', {
    type: KomodiType.bool,
    defaultValue: 'true',
    updateInput: toggle('true', 'false')
});

validatorMap.set('int', {
    type: KomodiType.int,
    defaultValue: '0',
    updateInput: (currentValue: string) => {
        let result = window.prompt('Change integer value', currentValue);
        if (result && /^[+-]?(0|[1-9]\d*)$/.test(currentValue)) {
            return result;
        }
        return null;
    }
});

validatorMap.set('scope', {
    type: KomodiType.empty,
    defaultValue: 'global',
    updateInput: toggle('internal', 'global')
});

validatorMap.set('definition', {
    type: KomodiType.empty,
    defaultValue: 'test [arg: int]',
    updateInput: (currentValue: string) => {
        let result = window.prompt('Change function definition', currentValue);
        if (result) {
            try {
                parseBlockDefinition({
                    id: 'test', definition: result,
                    nodeDrawer: definitionNodeDrawer, scopeDrawer: lineScopeDrawer
                });
                return result;
            } catch (e) {
                window.alert(e.toString());
            }
        }
        return null;
    }
});

export class PlaceholderToken {
    kind: "placeholder" = "placeholder";

    constructor(readonly text: string) {
    }
}

export class UserInputToken {
    kind: "user_input" = "user_input";

    constructor(readonly identifier: string, readonly validator: UserInputValidator) {
    }
}

export class ExpressionToken {
    kind: "expression" = "expression";

    constructor(readonly identifier: string, readonly type: KomodiType) {
    }
}

export type Token = PlaceholderToken | UserInputToken | ExpressionToken;


export interface BlockDefinitionBase {
    id: string;
    definition: string;
    scopeNames?: string[];
    nodeDrawer: NodeDrawer;
    scopeDrawer: ScopeDrawer;
}

export interface BlockDefinition {
    id: string;
    definition: string;
    tokens: Token[];
    returnType: KomodiType;
    inputNames: string[];
    argumentNames: string[];
    scopeNames: string[];
    nodeDrawer: NodeDrawer;
    scopeDrawer: ScopeDrawer;
}

export function parseBlockDefinition(definitionBase: BlockDefinitionBase): BlockDefinition {
    let parsed = blockDefinitionParser.parse(definitionBase.definition);
    let tokens = _.map(parsed.tokens, (token: any) => {
        switch (token.tokenType) {
            case "placeholder":
                return new PlaceholderToken(token.value);
            case "expression":
                return new ExpressionToken(token.identifier, typeFromString(token.type));
            case "user_input":
                let validatorId = token.validator;
                if (!validatorMap.has(validatorId)) {
                    throw new Error("parseBlockDefinition failed: unknown validator");
                }
                let validator = validatorMap.get(validatorId)!;
                return new UserInputToken(token.identifier, validator);
            default:
                throw new Error("parseBlockDefinition failed: unknown token type");
        }
    });

    return {
        id: definitionBase.id,
        definition: definitionBase.definition,
        tokens: tokens,
        returnType: parsed.returnType ? typeFromString(parsed.returnType) : KomodiType.empty,
        inputNames: _.filter(tokens, <(x: Token) => x is UserInputToken>((token) => token instanceof UserInputToken)).map((token) => token.identifier),
        argumentNames: _.filter(tokens, <(x: Token) => x is ExpressionToken>((token) => token instanceof ExpressionToken)).map((token) => token.identifier),
        scopeNames: definitionBase.scopeNames ? definitionBase.scopeNames : [],
        nodeDrawer: definitionBase.nodeDrawer,
        scopeDrawer: definitionBase.scopeDrawer
    }
}
