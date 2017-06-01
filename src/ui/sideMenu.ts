import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {StateSprite} from "./StateSprite";
import {centerChild, createLabel} from "../utils";
import {AbsControlFactory, AbsGenerator} from "../factories/ControlFactory";
import {InteractiveRect} from "./InteractiveRect";
import {GeneratorEventType} from "./customEvents";

export interface SideMenuInfo {
    name: string,
    factories: AbsControlFactory[],
}

const ACTIVE_COLOR = 0xF7F7F7;
const ACTIVE_HIGHLIGHT_COLOR = 0xBDBDBD;
const INACTIVE_COLOR = 0xFCFCFC;

const MENU_ITEM_WIDTH = 70;
const MENU_ITEM_HEIGHT = 70;

const GENERATOR_MARGIN = 10;
const GENERATOR_PADDING = 22;

const MENU_ITEM_PATH = [
    0, 0,
    MENU_ITEM_WIDTH, 0,
    MENU_ITEM_WIDTH, MENU_ITEM_HEIGHT,
    0, MENU_ITEM_HEIGHT,
    0, 0,
];

const INSIDE_PADDING = 8;

class MenuItem extends StateSprite {
    constructor(msg: string) {
        super();

        let inactive = new PIXI.Graphics();
        inactive.lineStyle(1);
        inactive.beginFill(INACTIVE_COLOR);
        inactive.drawPolygon(MENU_ITEM_PATH);

        let active = new PIXI.Graphics();
        active.beginFill(ACTIVE_COLOR);
        active.drawPolygon(MENU_ITEM_PATH);
        active.beginFill(ACTIVE_HIGHLIGHT_COLOR);
        active.drawPolygon([
            0, 0,
            INSIDE_PADDING, 0,
            INSIDE_PADDING, MENU_ITEM_HEIGHT,
            0, MENU_ITEM_HEIGHT,
            0, 0,
        ]);
        active.lineStyle(1);
        active.moveTo(0, 0);
        active.lineTo(MENU_ITEM_WIDTH, 0);
        active.moveTo(0, 0);
        active.lineTo(0, MENU_ITEM_HEIGHT);
        active.moveTo(0, MENU_ITEM_HEIGHT);
        active.lineTo(MENU_ITEM_WIDTH, MENU_ITEM_HEIGHT);

        this.addState("inactive", inactive);
        this.addState("active", active);

        this.setState("inactive");

        let label = createLabel(msg);
        this.addChild(label);
        centerChild(label, MENU_ITEM_WIDTH*.5, MENU_ITEM_HEIGHT*.5);

        this.interactive = true;
    }
}

class GeneratorList extends PIXI.Container {
    private generators: AbsGenerator[];
    private background: InteractiveRect;

    constructor(factories: AbsControlFactory[], private minHeight: number) {
        super();

        this.background = new InteractiveRect(ACTIVE_COLOR);
        this.addChild(this.background);

        this.generators = _.map(factories, (factory) => {
            let generator = new factory.generator(factory);
            this.addChild(generator);
            generator.on(GeneratorEventType.UPDATE_SHAPE, () => {
                this.update();
            });
            return generator;
        });

        this.update();
    }

    private update() {
        let backgroundWidth = 0, backgroundHeight = 0;

        _.forEach(this.generators, (generator) => {
            backgroundWidth = Math.max(backgroundWidth, generator.width);
            backgroundHeight += generator.height;
        });
        backgroundWidth += 2*GENERATOR_MARGIN;
        backgroundHeight += GENERATOR_PADDING * (this.generators.length + 1);
        backgroundHeight = Math.max(backgroundHeight, this.minHeight);

        let currentY = GENERATOR_MARGIN;
        _.forEach(this.generators, (generator) => {
            generator.x = backgroundWidth * .5;

            let bound = generator.getLocalBounds();
            generator.y = currentY + (-bound.top);
            currentY += generator.height + GENERATOR_PADDING;
        });

        this.background.updateRegion(new PIXI.Rectangle(
            0, 0, backgroundWidth, backgroundHeight
        ));

        let graphics = this.background.graphics;
        graphics.lineStyle(1);
        graphics.moveTo(0, 0);
        graphics.lineTo(backgroundWidth, 0);
        graphics.moveTo(backgroundWidth, 0);
        graphics.lineTo(backgroundWidth, backgroundHeight);
        graphics.moveTo(backgroundWidth, backgroundHeight);
        graphics.lineTo(0, backgroundHeight);
        graphics.moveTo(0, backgroundHeight);
        graphics.lineTo(0, this.minHeight);
    }
}

export class SideMenu extends PIXI.Container {
    private menuItems: MenuItem[];
    private activeIndex: number;
    private generatorViewer: StateSprite;

    constructor(infoArr: SideMenuInfo[]) {
        super();

        this.generatorViewer = new StateSprite();
        this.addChild(this.generatorViewer);
        this.generatorViewer.x = MENU_ITEM_WIDTH;

        let minHeight = MENU_ITEM_HEIGHT * infoArr.length;

        this.menuItems = _.map(infoArr, (info, i) => {
            let item = new MenuItem(info.name);
            this.addChild(item);
            item.y = MENU_ITEM_HEIGHT * i;
            item.on("click", () => {
                this.setActiveIndex(i);
            });

            this.generatorViewer.addState(`frame${i}`, new GeneratorList(info.factories, minHeight));

            return item;
        });

        this.activeIndex = 0;
        this.setActiveIndex(0);
    }

    setActiveIndex(index: number) {
        this.menuItems[this.activeIndex].setState("inactive");
        this.activeIndex = index;
        this.menuItems[index].setState("active");
        this.generatorViewer.setState(`frame${index}`);
    }
}