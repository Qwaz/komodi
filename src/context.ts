import * as PIXI from "pixi.js";
import {Attacher} from "./program/attacher";
import {Module} from "./program/module";
import {Block} from "./program";
import {Serializer} from "./program/serializer";

export class KomodiContext {
    readonly container: PIXI.Container = new PIXI.Container();
    readonly stage: PIXI.Container = new PIXI.Container();
    readonly fixed: PIXI.Container = new PIXI.Container();

    readonly attacher: Attacher;
    readonly module: Module;
    readonly serializer: Serializer;

    private _projectName: string;

    constructor() {
        this.attacher = new Attacher(this);
        this.module = new Module(this);
        this.serializer = new Serializer(this);

        this.container.interactive = true;
        this.container.addChild(this.stage, this.fixed);

        this.fixed.interactive = true;
    }

    get projectName() {
        return this._projectName;
    }

    set projectName(projectName: string) {
        this._projectName = projectName;
    }

    init() {
        this.attacher.init();
    }

    registerBlock(block: Block) {
        this.attacher.registerBlock(block);
        this.module.addBlockToModule(block.moduleName, block);
    }

    unregisterBlock(block: Block) {
        this.attacher.removeBlock(block);
        this.module.deleteBlockFromModule(block.moduleName, block);
    }
}
