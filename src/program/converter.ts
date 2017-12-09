import {Module} from "./module";
import {Block} from "./index";

function transpileBlock(block: Block) {
    let children: {[key: string]: string} = {};
    for (let inputName of block.definition.inputNames) {
        children[inputName] = block.getInput(inputName);
    }
    for (let argumentName of block.definition.argumentNames) {
        let argumentBlock = block.getArgument(argumentName);
        if (argumentBlock) {
            children[argumentName] = transpileBlock(argumentBlock);
        }
    }
    for (let scopeName of block.definition.scopeNames) {
        let scopeCode = '';
        for (let scopeBlock of block.getScope(scopeName)) {
            scopeCode += transpileBlock(scopeBlock);
        }
        children[scopeName] = scopeCode;
    }
    return block.definition.execution(children, block);
}

export function transpileModule(module: Module) {
    let code = '';

    for (let moduleName of module.getModuleList().userModule) {
        for (let block of module.blockListOf(moduleName)) {
            if (block.attachInfo == null) {
                code += transpileBlock(block);
            }
        }
    }

    return code;
}
