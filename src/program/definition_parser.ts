import peg = require("pegjs");
import * as _ from "lodash";
import {KomodiType, typeFromString} from "../type";
import {ExpressionToken, NodeDrawer, PlaceholderToken, ScopeDrawer, Token, UserInputToken} from "../graphic/index";

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

token
    = str: PLACEHOLDER
        { return {tokenType: "placeholder", value: str}; }
    / "[" identifier:IDENTIFIER ":" type: type "]"
        { return {tokenType: "expression", identifier: identifier, type: type}; }
    / "{" identifier:IDENTIFIER ":" type: type "}"
        { return {tokenType: "user_input", identifier: identifier, type: type}; }
`;

export const blockDefinitionParser = peg.generate(PARSER_DEFINITION);

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
        scopeNames: definitionBase.scopeNames ? definitionBase.scopeNames : [],
        nodeDrawer: definitionBase.nodeDrawer,
        scopeDrawer: definitionBase.scopeDrawer
    }
}
