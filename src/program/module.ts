import {Block, BlockClass} from "./index";
import {blockList as commonBlockList} from "./lib/common"
import {blockList as ioBlockList} from "./lib/io"
import {blockList as stringBlockList} from "./lib/string"
import {Komodi} from "../global";
import {BlockGraphic} from "../graphic/index";

const builtinModules: Map<string, BlockClass[]> = new Map();

builtinModules.set('common', commonBlockList);
builtinModules.set('io', ioBlockList);
builtinModules.set('string', stringBlockList);

export enum ExportScope {
    INTERNAL, GLOBAL
}

interface ExportResult {
    internalScope: Set<BlockClass>;
    globalScope: Set<BlockClass>;
}

export class Module extends PIXI.utils.EventEmitter {
    static readonly EDITING_MODULE_CHANGE = 'editingModuleChange';

    private readonly exports: Map<string, ExportResult>;
    private readonly idToBlockClass: Map<string, BlockClass>;

    private readonly userModuleBlocks: Map<string, Set<Block>>;

    private _editingModule: string | null = null;

    constructor() {
        super();

        this.exports = new Map();
        this.idToBlockClass = new Map();
        this.userModuleBlocks = new Map();

        for (let [moduleName, blocks] of builtinModules.entries()) {
            this.exports.set(moduleName, {
                internalScope: new Set(),
                globalScope: new Set()
            });
            for (let blockClass of blocks) {
                this.exports.get(moduleName)!.globalScope.add(blockClass);
                this.idToBlockClass.set(blockClass.definition.id, blockClass);
            }
        }
    }

    checkModuleExist(moduleName: string, soft: boolean = false): boolean {
        if (!this.exports.has(moduleName)) {
            if (soft) return false;
            throw new Error("checkModuleExist failed");
        }
        return true;
    }

    checkUserModuleExist(moduleName: string, soft: boolean = false): boolean {
        if (!this.userModuleBlocks.has(moduleName)) {
            if (soft) return false;
            throw new Error("checkUserModuleExist failed");
        }
        return true;
    }

    get editingModule() {
        return this._editingModule;
    }

    set editingModule(moduleName: string | null) {
        // clear stage
        for (let i = 0; i < Komodi.stage.children.length;) {
            let child = Komodi.stage.children[i];
            if (child instanceof BlockGraphic) {
                Komodi.stage.removeChild(child);
            } else {
                i++;
            }
        }

        if (moduleName) {
            this.checkUserModuleExist(moduleName);

            // setup stage
            for (let block of this.userModuleBlocks.get(moduleName)!.values()) {
                if (block.attachInfo == null) {
                    Komodi.stage.addChild(block.graphic);
                }
            }
        }

        this._editingModule = moduleName;
        this.emit(Module.EDITING_MODULE_CHANGE, moduleName);
    }

    getModuleList() {
        return {
            builtinModule: builtinModules.keys(),
            userModule: this.userModuleBlocks.keys()
        };
    }

    exportOf(moduleName: string): ExportResult {
        this.checkModuleExist(moduleName);
        return this.exports.get(moduleName)!;
    }

    getBlockClass(id: string): BlockClass {
        if (!this.idToBlockClass.has(id)) {
            throw new Error("getBlockClass failed: id does not exist");
        }
        return this.idToBlockClass.get(id)!;
    }

    blockListOf(moduleName: string): Set<Block> {
        this.checkUserModuleExist(moduleName);
        return this.userModuleBlocks.get(moduleName)!;
    }

    addBlockToModule(moduleName: string, block: Block) {
        this.checkUserModuleExist(moduleName);
        this.userModuleBlocks.get(moduleName)!.add(block);
    }

    deleteBlockFromModule(moduleName: string, block: Block) {
        this.checkUserModuleExist(moduleName);
        this.userModuleBlocks.get(moduleName)!.delete(block);
    }

    addUserModule(moduleName: string) {
        if (this.checkModuleExist(moduleName, true)) {
            throw new Error("addUserModule failed: module already exists");
        }

        this.userModuleBlocks.set(moduleName, new Set());
        this.exports.set(moduleName, {
            internalScope: new Set(),
            globalScope: new Set()
        });
        Komodi.sideMenu.moduleSelector.addModule(moduleName);
    }

    deleteUserModule(moduleName: string) {
        this.checkUserModuleExist(moduleName);

        for (let block of this.userModuleBlocks.get(moduleName)!.values()) {
            if (block.attachInfo == null) {
                block.destroy();
            }
        }
        this.userModuleBlocks.delete(moduleName);
        this.exports.delete(moduleName);
        Komodi.sideMenu.moduleSelector.deleteModule(moduleName);
    }

    addExport(moduleName: string, scope: ExportScope, blockClass: BlockClass) {
        this.checkUserModuleExist(moduleName);

        let exportResult = this.exportOf(moduleName);
        let exportSet = scope == ExportScope.GLOBAL ? exportResult.globalScope : exportResult.internalScope;

        exportSet.add(blockClass);
        this.idToBlockClass.set(blockClass.definition.id, blockClass);
    }

    deleteExport(moduleName: string, scope: ExportScope, blockClass: BlockClass) {
        this.checkUserModuleExist(moduleName);

        let exportResult = this.exportOf(moduleName);
        let exportSet = scope == ExportScope.GLOBAL ? exportResult.globalScope : exportResult.internalScope;

        exportSet.delete(blockClass);
        this.idToBlockClass.delete(blockClass.definition.id);
    }

    clear() {
        this.editingModule = null;
        for (let moduleName of this.userModuleBlocks.keys()) {
            this.deleteUserModule(moduleName);
        }
    }
}
