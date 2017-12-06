import * as PIXI from "pixi.js";
import {Komodi} from "./global";
import {BlockGenerator} from "./graphic/index";
import {BlockClass} from "./program/index";
import {ListSelector, MENU_COLOR, SimpleButton} from "./common/ui";
import {Module} from "./program/module";

const TOP_MENU_HEIGHT = 85;
const TOP_MENU_BUTTON_HEIGHT = 30;

const SIDE_MENU_WIDTH = 240;
const MODULE_SELECTOR_END_Y = 400;
const EDIT_BUTTON_MARGIN = 8;
const EDIT_BUTTON_HEIGHT = 40;

const BOTTOM_MENU_HEIGHT = 140;
const BOTTOM_MENU_TIP_WIDTH = 120;
const BOTTOM_MENU_TIP_HEIGHT = 30;

export class TopMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();
    label: PIXI.Text;

    private buttonList: PIXI.Container[] = [];
    private buttonX = 0;

    constructor() {
        super();

        this.addChild(this.background);

        this.label = new PIXI.Text("ERROR", {
            fontSize: 26, fill: MENU_COLOR.TEXT_SEMI_BLACK
        });
        this.addChild(this.label);
        this.label.x = 16;
        this.label.y = (TOP_MENU_HEIGHT - TOP_MENU_BUTTON_HEIGHT)*.5 - this.label.height*.5;
    }

    get projectName(): string {
        return this.label.text;
    }

    set projectName(text: string) {
        this.label.text = text;
    }

    update(width: number, _height: number) {
        this.background.clear();
        this.background.beginFill(MENU_COLOR.BACKGROUND_GREY);
        this.background.drawRect(0, 0, width, TOP_MENU_HEIGHT);

        this.background.lineStyle(0.5, MENU_COLOR.OUTLINE);
        this.background.moveTo(0, TOP_MENU_HEIGHT);
        this.background.lineTo(width, TOP_MENU_HEIGHT);
        this.background.moveTo(0, TOP_MENU_HEIGHT - TOP_MENU_BUTTON_HEIGHT);
        this.background.lineTo(width, TOP_MENU_HEIGHT - TOP_MENU_BUTTON_HEIGHT);
    }

    addMenu(text: string, callback: () => void) {
        const PADDING = 16;

        let label = new PIXI.Text(text, {fontSize: 12});

        let button = new SimpleButton(label.width + PADDING*2, TOP_MENU_BUTTON_HEIGHT);
        button.addChild(label);
        this.addChild(button);

        label.x = button.width*.5 - label.width*.5;
        label.y = button.height*.5 - label.height*.5;

        button.x = this.buttonX;
        button.y = TOP_MENU_HEIGHT-TOP_MENU_BUTTON_HEIGHT;
        this.buttonX += label.width + 2*PADDING;

        // interaction
        button.on('click', callback);

        this.buttonList.push(button);
    }
}

export class ModuleSelector extends PIXI.Container {
    static readonly SELECTED_MODULE_CHANGE = 'selectedModuleChange';

    readonly selector: ListSelector;

    constructor() {
        super();

        // setup module selector
        this.selector = new ListSelector(SIDE_MENU_WIDTH);
        this.addChild(this.selector);
    }

    init() {
        // built-in module
        let modules = Komodi.module.getModuleList();

        this.selector.addLabel('\uf02d  built-in modules');
        for (let moduleName of modules.builtinModule) {
            this.selector.addButton(moduleName, moduleName);
        }

        // user module
        this.selector.addLabel('\uf2be  user modules');

        this.selector.onChange = (moduleName: string | null) => {
            this.emit(ModuleSelector.SELECTED_MODULE_CHANGE, moduleName);
        };

        Komodi.module.on(Module.EDITING_MODULE_CHANGE, (changedModuleName: string | null) => {
            let modules = Komodi.module.getModuleList();
            for (let moduleName of modules.userModule) {
                if (moduleName == changedModuleName) {
                    this.selector.changeText(moduleName, `${moduleName} \uf040`);
                } else {
                    this.selector.changeText(moduleName, moduleName);
                }
            }
            this.emit(ModuleSelector.SELECTED_MODULE_CHANGE, this.selector.getSelectedKey());
        });
    }

    addModule(moduleName: string) {
        this.selector.addButton(moduleName, moduleName);
    }

    deleteModule(moduleName: string) {
        this.selector.deleteButton(moduleName);
    }
}

export class BlockGeneratorList extends PIXI.Container {
    blockList: BlockGenerator[] = [];

    constructor() {
        super();
    }

    init() {
        Komodi.sideMenu.moduleSelector.on(ModuleSelector.SELECTED_MODULE_CHANGE, (moduleName: string | null) => {
            this.clear();
            if (moduleName) {
                const VERTICAL_PADDING = 10;

                let exportResult = Komodi.module.exportOf(moduleName);

                let currentY = 0;
                let addGenerator = (blockClass: BlockClass) => {
                    let generator = new BlockGenerator(blockClass);
                    this.addChild(generator);
                    generator.x = SIDE_MENU_WIDTH*.5;
                    generator.y = currentY + VERTICAL_PADDING + generator.height;
                    this.blockList.push(generator);
                    currentY += generator.height + VERTICAL_PADDING;
                };

                for (let blockClass of exportResult.globalScope) {
                    addGenerator(blockClass);
                }
                if (Komodi.module.editingModule == moduleName) {
                    for (let blockClass of exportResult.internalScope) {
                        addGenerator(blockClass);
                    }
                }
            }
        });
    }

    clear() {
        for (let block of this.blockList) {
            this.removeChild(block);
            block.destroy();
        }
        this.blockList.length = 0;
    }
}

export class SideMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();
    outline: PIXI.Graphics = new PIXI.Graphics();

    moduleSelector: ModuleSelector = new ModuleSelector();
    blockGeneratorList: BlockGeneratorList = new BlockGeneratorList();
    editButton: SimpleButton;

    constructor() {
        super();

        this.interactive = true;

        this.addChild(this.background);
        this.addChild(this.moduleSelector, this.blockGeneratorList);

        let label = new PIXI.Text('Edit', {fontSize: 16});
        this.editButton = new SimpleButton(SIDE_MENU_WIDTH - 2*EDIT_BUTTON_MARGIN, EDIT_BUTTON_HEIGHT);
        this.editButton.addChild(label);
        label.x = this.editButton.width*.5 - label.width*.5;
        label.y = this.editButton.height*.5 - label.height*.5;
        this.editButton.on('click', () => {
            Komodi.module.editingModule = this.moduleSelector.selector.getSelectedKey();
        });
        this.moduleSelector.on(ModuleSelector.SELECTED_MODULE_CHANGE, (moduleName: string | null) => {
            if (moduleName && Komodi.module.checkUserModuleExist(moduleName, true)) {
                this.editButton.visible = true;
            } else {
                this.editButton.visible = false;
            }
        });
        this.editButton.visible = false;
        this.addChild(this.editButton);

        this.addChild(this.outline);
    }

    init() {
        this.moduleSelector.init();
        this.blockGeneratorList.init();
    }

    update(_width: number, height: number) {
        this.moduleSelector.y = TOP_MENU_HEIGHT;
        this.blockGeneratorList.y = MODULE_SELECTOR_END_Y;

        this.background.clear();
        this.background.beginFill(MENU_COLOR.BACKGROUND_WHITE);
        this.background.drawRect(0, TOP_MENU_HEIGHT, SIDE_MENU_WIDTH, height-TOP_MENU_HEIGHT);

        this.outline.clear();
        this.outline.lineStyle(1, MENU_COLOR.OUTLINE);
        this.outline.moveTo(0, MODULE_SELECTOR_END_Y);
        this.outline.lineTo(SIDE_MENU_WIDTH, MODULE_SELECTOR_END_Y);
        this.outline.moveTo(SIDE_MENU_WIDTH, TOP_MENU_HEIGHT);
        this.outline.lineTo(SIDE_MENU_WIDTH, height);

        this.editButton.x = SIDE_MENU_WIDTH*.5 - this.editButton.width*.5;
        this.editButton.y = height - EDIT_BUTTON_MARGIN - this.editButton.height;
    }
}

export class ConsoleMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();

    label: PIXI.Text;

    constructor() {
        super();
        this.interactive = true;

        this.label = new PIXI.Text('Output', {
            fontSize: 16, align : 'center'
        });

        this.addChild(this.background);
        this.addChild(this.label);
    }

    update(width: number, height: number) {
        const DIAGONAL_WIDTH = 10;
        const tipTop = height-BOTTOM_MENU_HEIGHT-BOTTOM_MENU_TIP_HEIGHT;

        this.label.x = SIDE_MENU_WIDTH + (BOTTOM_MENU_TIP_WIDTH-DIAGONAL_WIDTH)*.5 - this.label.width*.5;
        this.label.y = height-BOTTOM_MENU_HEIGHT-BOTTOM_MENU_TIP_HEIGHT*.5 - this.label.height*.5;

        this.background.clear();
        this.background.beginFill(MENU_COLOR.BACKGROUND_WHITE);
        this.background.lineStyle(1, MENU_COLOR.OUTLINE);

        // draw console area
        this.background.moveTo(SIDE_MENU_WIDTH, tipTop);
        this.background.lineTo(SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH-DIAGONAL_WIDTH, tipTop);
        this.background.lineTo(SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH, height-BOTTOM_MENU_HEIGHT);
        this.background.lineTo(width, height-BOTTOM_MENU_HEIGHT);
        this.background.lineTo(width, height);
        this.background.lineTo(SIDE_MENU_WIDTH, height);
        this.background.lineTo(SIDE_MENU_WIDTH, tipTop);
    }
}
