import * as PIXI from "pixi.js";
import {BlockClass, builtinModules} from "./program/lib/index";
import {Komodi} from "./global";
import {BlockGenerator} from "./graphic/index";

const TOP_MENU_HEIGHT = 85;
const TOP_MENU_BUTTON_HEIGHT = 30;
const SIDE_MENU_WIDTH = 240;
const MODULE_MENU_END_Y = 350;
const BOTTOM_MENU_HEIGHT = 140;
const BOTTOM_MENU_TIP_WIDTH = 120;
const BOTTOM_MENU_TIP_HEIGHT = 30;

enum MENU_COLOR {
    BACKGROUND_GREY = 0xf2f2f2,
    BACKGROUND_WHITE = 0xfcfcfc,

    BUTTON_NORMAL = 0xfcfcfc,
    BUTTON_HOVER = 0xe8eaed,
    BUTTON_SELECTED = 0x1a7dc4,

    OUTLINE = 0xc8c8c8,

    TEXT_WHITE = 0xffffff,
    TEXT_SEMI_BLACK = 0x303030,
    TEXT_BLUE = 0x0366d6,
}

export class TopMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();
    label: PIXI.Text;

    private buttonList: PIXI.Container[] = [];
    private buttonX = 0;

    constructor() {
        super();

        this.addChild(this.background);

        this.label = new PIXI.Text("Untitled Komodi Project", {
            fontSize: 26, fill: MENU_COLOR.TEXT_SEMI_BLACK
        });
        this.addChild(this.label);
        this.label.x = 16;
        this.label.y = (TOP_MENU_HEIGHT - TOP_MENU_BUTTON_HEIGHT)*.5 - this.label.height*.5;
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

        let label = new PIXI.Text(text, {
            fontSize: 12
        });
        let background = new PIXI.Graphics();
        let button = new PIXI.Container();
        button.addChild(background, label);
        this.addChild(button);

        let setStyleNormal = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_NORMAL);
            background.lineStyle(0.5, MENU_COLOR.OUTLINE);
            background.drawRect(0, 0, label.width + 2*PADDING, TOP_MENU_BUTTON_HEIGHT);
        };
        let setStyleHover = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_HOVER);
            background.lineStyle(0.5, MENU_COLOR.OUTLINE);
            background.drawRect(0, 0, label.width + 2*PADDING, TOP_MENU_BUTTON_HEIGHT);
        };
        setStyleNormal();

        label.x = background.width*.5 - label.width*.5;
        label.y = background.height*.5 - label.height*.5;

        button.x = this.buttonX;
        button.y = TOP_MENU_HEIGHT-TOP_MENU_BUTTON_HEIGHT;
        this.buttonX += button.width;

        // interaction
        button.interactive = true;
        button.buttonMode = true;
        button.on('mouseover', setStyleHover);
        button.on('mouseout', setStyleNormal);

        this.buttonList.push(button);
    }
}

class ListSelector<T> extends PIXI.Container {
    onChange: (index: number, data: T | null) => void;

    private _selectedIndex: number = -1;
    private buttonList: PIXI.Container[] = [];
    private dataList: T[] = [];

    constructor(private backgroundWidth: number) {
        super();
    }

    private get selectedIndex() {
        return this._selectedIndex
    }

    private set selectedIndex(value: number) {
        if (this.onChange) {
            this.onChange(value, value == -1 ? null : this.dataList[value]);
        }
        this._selectedIndex = value;
    }

    addButton(text: string, data: T) {
        const LIST_BUTTON_HEIGHT = 35;

        let currentIndex = this.buttonList.length;

        let label = new PIXI.Text(text, {
            fontSize: 16, fill:MENU_COLOR.TEXT_BLUE
        });
        let background = new PIXI.Graphics();
        let button = new PIXI.Container();
        button.addChild(background, label);
        this.addChild(button);

        let setStyleNormal = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_NORMAL);
            background.drawRect(0, 0, this.backgroundWidth, LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_BLUE;
        };
        let setStyleHover = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_HOVER);
            background.drawRect(0, 0, this.backgroundWidth, LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_BLUE;
        };
        let setStyleSelected = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_SELECTED);
            background.drawRect(0, 0, this.backgroundWidth, LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_WHITE;
        };
        setStyleNormal();

        label.x = 20;
        label.y = background.height*.5 - label.height*.5;
        button.y = LIST_BUTTON_HEIGHT * currentIndex;

        // interaction
        button.interactive = true;
        button.buttonMode = true;
        button.on('mouseover', () => {
            if (this.selectedIndex != currentIndex) {
                setStyleHover();
            }
        });
        button.on('mouseout', () => {
            if (this.selectedIndex != currentIndex) {
                setStyleNormal();
            }
        });
        button.on('click', () => {
            let prevIndex = this.selectedIndex;
            if (prevIndex == currentIndex) {
                this.selectedIndex = -1;
                setStyleHover();
            } else {
                this.selectedIndex = currentIndex;
                if (prevIndex != -1) {
                    this.buttonList[prevIndex].emit('mouseout');
                }
                setStyleSelected();
            }
        });

        this.buttonList.push(button);
        this.dataList.push(data);
    }
}

export class ModuleSelector extends PIXI.Container {
    builtinModules: Map<string, BlockClass[]>;
    moduleSelector: ListSelector<BlockClass[]>;

    constructor() {
        const PADDING = 10;

        const HEADING_STYLE = {
            fontFamily: 'FontAwesome',
            fill: MENU_COLOR.TEXT_SEMI_BLACK, fontSize: 18, fontWeight: 'bold'
        };

        super();
        this.builtinModules = builtinModules;

        let builtinLabel = new PIXI.Text('\uf115 built-in modules', HEADING_STYLE);
        this.addChild(builtinLabel);
        builtinLabel.x = PADDING;
        builtinLabel.y = PADDING;

        // setup module selector
        this.moduleSelector = new ListSelector(SIDE_MENU_WIDTH);
        this.addChild(this.moduleSelector);
        this.moduleSelector.y = PADDING*2 + builtinLabel.height;
        for (let [setName, blocks] of this.builtinModules) {
            this.moduleSelector.addButton(setName, blocks);
        }

        this.moduleSelector.onChange = (_index, set: BlockClass[] | null) => {
            Komodi.sideMenu.changeBlockSet(set);
        };
    }
}

export class BlockGeneratorList extends PIXI.Container {
    blockList: BlockGenerator[] = [];

    constructor() {
        super();
    }

    clear() {
        for (let block of this.blockList) {
            this.removeChild(block);
            block.destroy();
        }
        this.blockList.length = 0;
    }

    update(blockSet: BlockClass[] | null) {
        this.clear();
        if (blockSet) {
            const VERTICAL_PADDING = 10;

            let currentY = 0;
            for (let blockClass of blockSet) {
                let generator = new BlockGenerator(blockClass);
                this.addChild(generator);
                generator.x = SIDE_MENU_WIDTH*.5;
                generator.y = currentY + VERTICAL_PADDING + generator.height;
                this.blockList.push(generator);
                currentY += generator.height + VERTICAL_PADDING;
            }
        }
    }
}

export class SideMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();

    topContent: ModuleSelector = new ModuleSelector();
    bottomContent: BlockGeneratorList = new BlockGeneratorList();

    constructor() {
        super();
        this.interactive = true;

        this.addChild(this.background, this.topContent, this.bottomContent);

        this.topContent.y = TOP_MENU_HEIGHT;
        this.bottomContent.y = MODULE_MENU_END_Y;
    }

    changeBlockSet(blockSet: BlockClass[] | null) {
        this.bottomContent.update(blockSet);
    }

    update(_width: number, height: number) {
        this.background.clear();
        this.background.beginFill(MENU_COLOR.BACKGROUND_WHITE);
        this.background.drawRect(0, TOP_MENU_HEIGHT, SIDE_MENU_WIDTH, height-TOP_MENU_HEIGHT);
        this.background.lineStyle(1, MENU_COLOR.OUTLINE);
        this.background.moveTo(0, MODULE_MENU_END_Y);
        this.background.lineTo(SIDE_MENU_WIDTH, MODULE_MENU_END_Y);
        this.background.moveTo(SIDE_MENU_WIDTH, TOP_MENU_HEIGHT);
        this.background.lineTo(SIDE_MENU_WIDTH, height);
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
