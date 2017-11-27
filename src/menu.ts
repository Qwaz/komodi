import * as PIXI from "pixi.js";
import {BlockClass, builtinModules} from "./program/lib/index";
import {Komodi} from "./global";
import {BlockGenerator} from "./graphic/index";

const SIDE_MENU_WIDTH = 330;
const TOP_MENU_HEIGHT = 350;
const BOTTOM_MENU_HEIGHT = 200;
const BOTTOM_MENU_TIP_WIDTH = 120;
const BOTTOM_MENU_TIP_HEIGHT = 30;

let selectedModule: BlockClass[] | null = null;

class ModuleButton extends PIXI.Text {
    constructor(text: string) {
        super(text, {
            fontSize: 18, align: 'center', fill: 0x0366d6
        });

        this.interactive = true;
        this.buttonMode = true;
    }
}

export class BlockModuleSelector extends PIXI.Container {
    builtinModules: Map<string, BlockClass[]>;

    constructor() {
        const PADDING = 10;
        const LEFT_INDENT = 30;

        const HEADING_STYLE = {
            fontFamily: 'FontAwesome',
            fontSize: 18, fontWeight: 'bold'
        };

        super();
        this.builtinModules = builtinModules;

        let builtinLabel = new PIXI.Text('\uf115 built-in modules', HEADING_STYLE);
        this.addChild(builtinLabel);
        builtinLabel.x = PADDING;
        builtinLabel.y = PADDING;
        this.arrangeModuleButton(LEFT_INDENT, PADDING + builtinLabel.height + PADDING, this.builtinModules);
    }

    private arrangeModuleButton(startX: number, startY: number, set: Map<string, BlockClass[]>) {
        let cnt = 0;
        for (let [setName, blocks] of set) {
            let label = new ModuleButton(setName);
            this.addChild(label);
            label.x = startX;
            label.y = startY + label.height*(cnt++);

            label.on('click', () => {
                selectedModule = blocks;
                Komodi.sideMenu.updateBlock();
            });
        }
    }
}

export class BlockViewer extends PIXI.Container {
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
                let generator = new BlockGenerator(blockClass.definition);
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
    bottomMask: PIXI.Graphics = new PIXI.Graphics();
    background: PIXI.Graphics = new PIXI.Graphics();

    topContent: BlockModuleSelector = new BlockModuleSelector();
    bottomContent: BlockViewer = new BlockViewer();

    constructor() {
        super();
        this.interactive = true;

        this.addChild(this.background, this.bottomMask, this.topContent, this.bottomContent);

        this.bottomContent.mask = this.bottomMask;

        this.bottomContent.y = TOP_MENU_HEIGHT;
    }

    updateBlock() {
        this.bottomContent.update(selectedModule);
    }

    update(_width: number, height: number) {
        this.background.clear();
        this.background.beginFill(0xfcfcfc);
        this.background.drawRect(0, 0, SIDE_MENU_WIDTH, height);
        this.background.lineStyle(2, 0xc0c0c0);
        this.background.moveTo(0, TOP_MENU_HEIGHT);
        this.background.lineTo(SIDE_MENU_WIDTH, TOP_MENU_HEIGHT);
        this.background.moveTo(SIDE_MENU_WIDTH, 0);
        this.background.lineTo(SIDE_MENU_WIDTH, height);

        this.bottomMask.clear();
        this.bottomMask.drawRect(0, TOP_MENU_HEIGHT, SIDE_MENU_WIDTH, height - TOP_MENU_HEIGHT);

        this.updateBlock();
    }
}

export class BottomMenu extends PIXI.Container {
    background: PIXI.Graphics = new PIXI.Graphics();

    label: PIXI.Text;

    constructor() {
        super();
        this.interactive = true;

        this.label = new PIXI.Text('Console', {
            fontSize: 16, align : 'center'
        });

        this.addChild(this.background);
        this.addChild(this.label);
    }

    update(width: number, height: number) {
        const tipTop = height-BOTTOM_MENU_HEIGHT-BOTTOM_MENU_TIP_HEIGHT;

        this.label.x = SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH*.5 - this.label.width*.5;
        this.label.y = height-BOTTOM_MENU_HEIGHT-BOTTOM_MENU_TIP_HEIGHT*.5 - this.label.height*.5;

        this.background.clear();
        this.background.beginFill(0xfcfcfc);
        this.background.lineStyle(2, 0xc0c0c0);
        this.background.moveTo(SIDE_MENU_WIDTH, height-BOTTOM_MENU_HEIGHT);
        this.background.quadraticCurveTo(SIDE_MENU_WIDTH, tipTop,
            SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_HEIGHT, tipTop);
        this.background.moveTo(SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_HEIGHT, tipTop);
        this.background.lineTo(SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH-BOTTOM_MENU_TIP_HEIGHT, tipTop);
        this.background.quadraticCurveTo(SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH, tipTop,
            SIDE_MENU_WIDTH+BOTTOM_MENU_TIP_WIDTH, height-BOTTOM_MENU_HEIGHT);
        this.background.lineTo(width, height-BOTTOM_MENU_HEIGHT);
        this.background.lineTo(width, height);
        this.background.lineTo(SIDE_MENU_WIDTH, height);
        this.background.lineTo(SIDE_MENU_WIDTH, height-BOTTOM_MENU_HEIGHT);
    }
}
