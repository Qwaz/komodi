import {Coordinate} from "../common/definition";
import {Komodi} from "../global";
import {Block} from "./index";

export interface SerializedBlock {
    id: string;
    data: {[name: string]: SerializedBlock | SerializedBlock[] | string};
}

export interface FreeBlock {
    position: Coordinate;
    blockData: SerializedBlock;
}

export interface SerializedModule {
    moduleName: string;
    freeBlocks: FreeBlock[];
}

export type SerializedProgram = {
    projectName: string,
    modules: SerializedModule[]
};

function serializeBlock(block: Block): SerializedBlock {
    let result: SerializedBlock = {
        id: block.definition.id,
        data: {}
    };

    for (let inputName of block.definition.inputNames) {
        result.data[inputName] = block.getInput(inputName);
    }

    for (let argumentName of block.definition.argumentNames) {
        let argumentBlock = block.getArgument(argumentName);
        if (argumentBlock) {
            result.data[argumentName] = serializeBlock(argumentBlock);
        }
    }

    for (let scopeName of block.definition.scopeNames) {
        result.data[scopeName] = block.getScope(scopeName).map(serializeBlock);
    }

    return result;
}

export function serializeProgram(): SerializedProgram {
    let modules = [];

    for (let moduleName of Komodi.module.getModuleList().userModule) {
        let freeBlocks = [];
        for (let block of Komodi.module.blockListOf(moduleName)) {
            if (block.attachInfo == null) {
                freeBlocks.push({
                    position: {x: block.graphic.x, y: block.graphic.y},
                    blockData: serializeBlock(block)
                });
            }
        }

        modules.push({
            moduleName: moduleName,
            freeBlocks: freeBlocks
        });
    }

    return {
        projectName: Komodi.topMenu.projectName,
        modules: modules
    };
}

function deserializeBlock(moduleName: string, blockData: SerializedBlock): Block {
    let blockClass = Komodi.module.getBlockClass(blockData.id);
    let block = new blockClass();
    block.init(moduleName);

    for (let inputName of blockClass.definition.inputNames) {
        (<any>block)[inputName] = blockData.data[inputName];
    }

    for (let argumentName of blockClass.definition.argumentNames) {
        if (blockData.data.hasOwnProperty(argumentName)) {
            let argumentBlockData = <SerializedBlock>blockData.data[argumentName];
            let argumentBlock = deserializeBlock(moduleName, argumentBlockData);
            block.attachBlock({
                attachType: "argument",
                target: block,
                argumentName: argumentName
            }, argumentBlock);
        }
    }

    for (let scopeName of blockClass.definition.scopeNames) {
        let cnt = 0;
        for (let scopeBlockData of <SerializedBlock[]>blockData.data[scopeName]) {
            let scopeBlock = deserializeBlock(moduleName, scopeBlockData);
            block.attachBlock({
                attachType: "scope",
                target: block,
                scopeName: scopeName,
                scopeIndex: cnt
            }, scopeBlock);
            cnt++;
        }
    }

    block.updateGraphic();

    return block;
}

export function deserializeProgram(program: SerializedProgram) {
    Komodi.topMenu.projectName = program.projectName;

    for (let module of program.modules) {
        Komodi.module.addUserModule(module.moduleName);
        for (let freeBlock of module.freeBlocks) {
            let block = deserializeBlock(module.moduleName, freeBlock.blockData);

            block.graphic.x = freeBlock.position.x;
            block.graphic.y = freeBlock.position.y;
        }
    }
    Komodi.module.editingModule = program.modules[0].moduleName;
}
