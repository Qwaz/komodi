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
