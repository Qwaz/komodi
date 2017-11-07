import peg = require("pegjs");
import {Token} from "../graphic/index";
import {KomodiType} from "../type";

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

export interface BlockDefinition {
    id: string;
    definition: string;
    tokens: Token[];
    returnType: KomodiType;
    argumentNames: string[];
    scopeNames: string[];
}
