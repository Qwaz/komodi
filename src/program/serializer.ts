import {Coordinate} from "../common/definition";
import {Komodi} from "../global";
import {Block} from "./index";
import {BlockGraphic} from "../graphic/index";
import {blockClassDictionary} from "./lib/index";

export interface SerializedBlock {
    id: string;
    data: {[name: string]: SerializedBlock | SerializedBlock[]};
}

export interface FreeBlock {
    position: Coordinate;
    blockData: SerializedBlock;
}

export type SerializedProgram = FreeBlock[];

function serializeBlock(block: Block): SerializedBlock {
    let result: SerializedBlock = {
        id: block.definition.id,
        data: {}
    };

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
    let result = [];
    for (let blockGraphic of Komodi.stage.children) {
        if (blockGraphic instanceof BlockGraphic) {
            result.push({
                position: {x: blockGraphic.x, y: blockGraphic.y},
                blockData: serializeBlock(blockGraphic.logic),
            })
        }
    }

    return result;
}

function deserializeBlock(blockData: SerializedBlock): Block {
    let blockClass = blockClassDictionary.get(blockData.id)!;
    let block = new blockClass();

    for (let argumentName of blockClass.definition.argumentNames) {
        if (blockData.data.hasOwnProperty(argumentName)) {
            let argumentBlockData = <SerializedBlock>blockData.data[argumentName];
            let argumentBlock = deserializeBlock(argumentBlockData);
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
            let scopeBlock = deserializeBlock(scopeBlockData);
            block.attachBlock({
                attachType: "scope",
                target: block,
                scopeName: scopeName,
                scopeIndex: cnt
            }, scopeBlock);
            cnt++;
        }
    }

    return block;
}

export function deserializeProgram(program: SerializedProgram) {
    for (let freeBlock of program) {
        let block = deserializeBlock(freeBlock.blockData);
        Komodi.stage.addChild(block.graphic);
        block.graphic.x = freeBlock.position.x;
        block.graphic.y = freeBlock.position.y;
    }
}
