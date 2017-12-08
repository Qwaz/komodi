import {Coordinate} from "../common/definition";
import {Komodi} from "../komodi";
import {Block, BlockClass, createAnonymousCommand, createAnonymousExpression} from "./index";
import {AttachInfo} from "./attacher";
import {parseBlockDefinition} from "./definition_parser";
import {defaultNodeDrawer} from "../graphic/node_drawer";
import {lineScopeDrawer} from "../graphic/scope_drawer";
import {KomodiType} from "../type";

export interface SerializedBlock {
    id: string;
    data: {[name: string]: SerializedBlock | SerializedBlock[] | string};
    definition?: string;
    exportId: string[];
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

const NOT_FOUND_ID = 'NotFound';

function serializeBlock(block: Block): SerializedBlock {
    let result: SerializedBlock = {
        id: block.definition.id,
        data: {},
        exportId: block.getExportId()
    };

    // Not Found Block
    if (!Komodi.module.hasBlockClass(block.definition.id)) {
        result.id = NOT_FOUND_ID;
        result.definition = block.definition.definition;
    }

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

    for (let extraName of block.definition.extraNames) {
        result.data[extraName] = block.getExtra(extraName);
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

interface DelayedAttachBlock {
    blockData: SerializedBlock;
    attachInfo: AttachInfo;
    moduleName: string;
}

interface DelayedFreeBlock {
    blockData: SerializedBlock;
    position: Coordinate;
    moduleName: string;
}

type DelayedBlock = DelayedAttachBlock | DelayedFreeBlock;

let delayed: Set<DelayedBlock>;

function deserializeBlock(moduleName: string, blockData: SerializedBlock): Block | null {
    let blockClass: BlockClass;
    if (Komodi.module.hasBlockClass(blockData.id)) {
        blockClass = Komodi.module.getBlockClass(blockData.id);
    } else if (blockData.id == NOT_FOUND_ID) {
        let definition = parseBlockDefinition({
            id: NOT_FOUND_ID, definition: blockData.definition!,
            nodeDrawer: defaultNodeDrawer, scopeDrawer: lineScopeDrawer
        });
        if (definition.returnType == KomodiType.empty) {
            blockClass = createAnonymousCommand(definition);
        } else {
            blockClass = createAnonymousExpression(definition);
        }

    } else {
        // delay processing
        return null;
    }

    let block = new blockClass();
    block.init(moduleName);

    for (let inputName of blockClass.definition.inputNames) {
        (<any>block)[inputName] = blockData.data[inputName];
    }

    for (let argumentName of blockClass.definition.argumentNames) {
        if (blockData.data.hasOwnProperty(argumentName)) {
            let argumentBlockData = <SerializedBlock>blockData.data[argumentName];
            let argumentBlock = deserializeBlock(moduleName, argumentBlockData);
            let argumentAttachInfo: AttachInfo = {
                attachType: "argument",
                target: block,
                argumentName: argumentName
            };

            if (argumentBlock) {
                block.attachBlock(argumentAttachInfo, argumentBlock);
            } else {
                delayed.add({
                    blockData: argumentBlockData,
                    attachInfo: argumentAttachInfo,
                    moduleName: moduleName
                });
            }
        }
    }

    for (let scopeName of blockClass.definition.scopeNames) {
        let cnt = 0;
        for (let scopeBlockData of <SerializedBlock[]>blockData.data[scopeName]) {
            let scopeBlock = deserializeBlock(moduleName, scopeBlockData);
            let scopeAttachInfo: AttachInfo = {
                attachType: "scope",
                target: block,
                scopeName: scopeName,
                scopeIndex: cnt
            };
            cnt++;

            if (scopeBlock) {
                block.attachBlock(scopeAttachInfo, scopeBlock);
            } else {
                delayed.add({
                    blockData: scopeBlockData,
                    attachInfo: scopeAttachInfo,
                    moduleName: moduleName
                });
            }
        }
    }

    block.setExportId(blockData.exportId);

    block.updateGraphic();

    return block;
}

export function deserializeProgram(program: SerializedProgram) {
    Komodi.topMenu.projectName = program.projectName;

    delayed = new Set();
    for (let module of program.modules) {
        Komodi.module.addUserModule(module.moduleName);
        for (let freeBlock of module.freeBlocks) {
            delayed.add({
                blockData: freeBlock.blockData,
                position: freeBlock.position,
                moduleName: module.moduleName
            });
        }
    }

    let isDelayedFreeBlock = (delayedBlock: DelayedBlock): delayedBlock is DelayedFreeBlock => {
        return delayedBlock.hasOwnProperty('position');
    };

    while (delayed.size > 0) {
        for (let delayedBlock of delayed.values()) {
            if (isDelayedFreeBlock(delayedBlock)) {
                let block = deserializeBlock(delayedBlock.moduleName, delayedBlock.blockData);

                if (block) {
                    block.graphic.x = delayedBlock.position.x;
                    block.graphic.y = delayedBlock.position.y;
                    delayed.delete(delayedBlock);
                }
            } else {
                let block = deserializeBlock(delayedBlock.moduleName, delayedBlock.blockData);

                if (block) {
                    delayedBlock.attachInfo.target.attachBlock(delayedBlock.attachInfo, block);
                    delayed.delete(delayedBlock);
                }
            }
        }

    }
    Komodi.module.editingModule = program.modules[0].moduleName;
}
