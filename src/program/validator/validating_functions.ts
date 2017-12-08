import * as _ from "lodash";
import {ValidationContext, ValidationFunction} from "./index";
import {Block, Definition} from "../index";
import {Module} from "../module";

export function dependencyCheck(block: Block, module: Module, context: ValidationContext) {
    if (!module.hasBlockClass(block.definition.id)) {
        context.result.error.push(`Broken dependency "${block.definition.definition}"`);
    }
}

export function freeBlockDefinitionCheck(block: Block, module: Module, context: ValidationContext) {
    if (block.attachInfo == null && !(block instanceof Definition)) {
        context.result.warning.push("Only definition can be unbound.");
    }
}

export function argumentCheck(block: Block, module: Module, context: ValidationContext) {
    for (let argumentName of block.definition.argumentNames) {
        let argumentBlock = block.getArgument(argumentName);
        if (argumentBlock == null) {
            context.result.warning.push("All argument should be filled.");
            break;
        }
    }
}

export function addToScopeTree(block: Block, module: Module, context: ValidationContext) {
    context.scopeTree.push(block);
}

export function checkScopeTree(block: Block) {
    return (block: Block, module: Module, context: ValidationContext) => {
        if (!_.includes(context.scopeTree, block)) {
            context.result.error.push(`"${block.definition.definition}" is in the wrong scope.`);
        }
    }
}

export const validatorPreAll: ValidationFunction[] = [
    dependencyCheck, freeBlockDefinitionCheck, argumentCheck
];

export const validatorIntoAll: ValidationFunction[] = [
    addToScopeTree,
];
