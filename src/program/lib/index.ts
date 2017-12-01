import {blockList as commonBlockList} from "./common"
import {blockList as ioBlockList} from "./io"
import {blockList as stringBlockList} from "./string"
import {Block} from "../index";
import {BlockDefinition} from "../definition_parser";

export interface BlockClass {
    new (): Block;
    definition: BlockDefinition;
}

export const builtinModules: Map<string, BlockClass[]> = new Map();

builtinModules.set('common', commonBlockList);
builtinModules.set('io', ioBlockList);
builtinModules.set('string', stringBlockList);

export let blockClassDictionary: Map<string, BlockClass> = new Map();

for (let [_set, blocks] of builtinModules.entries()) {
    for (let blockClass of blocks) {
        blockClassDictionary.set(blockClass.definition.id, blockClass);
    }
}
