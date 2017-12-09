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
            context.result.warning.push("All arguments should be filled.");
            break;
        }
    }
}

export function addToScopeTree(block: Block, module: Module, context: ValidationContext) {
    context.scopeTree.push(block);
}

export function checkScopeTree(parentBlock: Block) {
    return (block: Block, module: Module, context: ValidationContext) => {
        if (!_.includes(context.scopeTree, parentBlock)) {
            context.result.error.push(`"${block.definition.definition}" is in the wrong scope.`);
        }
    }
}

export function increaseLoopCount(block: Block, module: Module, context: ValidationContext) {
    context.loopDepth++;
}

export function insideLoop(block: Block, module: Module, context: ValidationContext) {
    if (context.loopDepth == 0) {
        context.result.error.push(`"${block.definition.definition}" should be inside of a loop.`);
    }
}

export const validatorPreAll: ValidationFunction[] = [
    dependencyCheck, freeBlockDefinitionCheck, argumentCheck
];

export const validatorIntoAll: ValidationFunction[] = [
    addToScopeTree,
];
