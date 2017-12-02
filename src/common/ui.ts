import {ICON_FONT} from "./definition";

export enum MENU_COLOR {
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

export class ListSelector extends PIXI.Container {
    static readonly LIST_BUTTON_HEIGHT = 35;
    static readonly LABEL_LEFT = 10;
    static readonly BUTTON_LEFT = 20;

    onChange: ((key: string | null) => void) | null = null;

    private _selectedKey: string | null = null;

    private labelList: PIXI.Text[] = [];
    private buttonList: PIXI.Container[] = [];
    private keyList: (string | null)[] = [];

    constructor(private backgroundWidth: number) {
        super();
    }

    getSelectedKey() {
        return this._selectedKey;
    }

    private get selectedKey() {
        return this._selectedKey;
    }

    private set selectedKey(value: string | null) {
        if (this.onChange) {
            this.onChange(value);
        }
        this._selectedKey = value;
    }

    addButton(text: string, key: string) {
        if (this.keyList.indexOf(key) != -1) {
            throw new Error("addButton failed: duplicate key");
        }

        let currentIndex = this.buttonList.length;

        let label = new PIXI.Text(text, {
            fontFamily: ICON_FONT,
            fontSize: 16, fill: MENU_COLOR.TEXT_BLUE
        });
        let background = new PIXI.Graphics();
        let button = new PIXI.Container();
        button.addChild(background, label);
        this.addChild(button);

        let setStyleNormal = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_NORMAL);
            background.drawRect(0, 0, this.backgroundWidth, ListSelector.LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_BLUE;
        };
        let setStyleHover = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_HOVER);
            background.drawRect(0, 0, this.backgroundWidth, ListSelector.LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_BLUE;
        };
        let setStyleSelected = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_SELECTED);
            background.drawRect(0, 0, this.backgroundWidth, ListSelector.LIST_BUTTON_HEIGHT);
            label.style.fill = MENU_COLOR.TEXT_WHITE;
        };
        setStyleNormal();

        label.x = ListSelector.BUTTON_LEFT;
        label.y = ListSelector.LIST_BUTTON_HEIGHT * .5 - label.height * .5;
        button.y = ListSelector.LIST_BUTTON_HEIGHT * currentIndex;

        // interaction
        button.interactive = true;
        button.buttonMode = true;
        button.on('mouseover', () => {
            if (this.selectedKey != key) {
                setStyleHover();
            }
        });
        button.on('mouseout', () => {
            if (this.selectedKey != key) {
                setStyleNormal();
            }
        });
        button.on('click', () => {
            let prevKey = this.selectedKey;
            if (prevKey == key) {
                this.selectedKey = null;
                setStyleHover();
            } else {
                this.selectedKey = key;
                if (prevKey != null) {
                    this.buttonList[this.keyList.indexOf(prevKey)].emit('mouseout');
                }
                setStyleSelected();
            }
        });

        this.labelList.push(label);
        this.buttonList.push(button);
        this.keyList.push(key);
    }

    addLabel(text: string) {
        let currentIndex = this.buttonList.length;

        let label = new PIXI.Text(text, {
            fontFamily: ICON_FONT,
            fill: MENU_COLOR.TEXT_SEMI_BLACK, fontSize: 16, fontWeight: 'bold'
        });
        let background = new PIXI.Graphics();
        background.beginFill(MENU_COLOR.BACKGROUND_GREY);
        background.drawRect(0, 0, this.backgroundWidth, ListSelector.LIST_BUTTON_HEIGHT);
        let button = new PIXI.Container();
        button.addChild(background, label);
        this.addChild(button);

        label.x = ListSelector.LABEL_LEFT;
        label.y = ListSelector.LIST_BUTTON_HEIGHT * .5 - label.height * .5;
        button.y = ListSelector.LIST_BUTTON_HEIGHT * currentIndex;

        // interaction
        this.labelList.push(label);
        this.buttonList.push(button);
        this.keyList.push(null);
    }

    changeText(key: string, text: string) {
        let index = this.keyList.indexOf(key);
        if (index == -1) {
            throw new Error("changeText failed: key does not exist");
        }
        this.labelList[index].text = text;
    }

    deleteButton(key: string) {
        let index = this.keyList.indexOf(key);
        if (index == -1) {
            throw new Error("changeText failed: key does not exist");
        }

        this.labelList.splice(index, 1);
        this.buttonList.splice(index, 1);
        this.keyList.splice(index, 1);

        for (let i = index; i < this.buttonList.length; i++) {
            this.buttonList[i].y -= ListSelector.LIST_BUTTON_HEIGHT;
        }
    }
}

export class SimpleButton extends PIXI.Container {
    constructor(width: number, height: number) {
        super();

        let background = new PIXI.Graphics();
        this.addChild(background);

        let setStyleNormal = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_NORMAL);
            background.lineStyle(0.5, MENU_COLOR.OUTLINE);
            background.drawRect(0, 0, width, height);
        };
        let setStyleHover = () => {
            background.clear();
            background.beginFill(MENU_COLOR.BUTTON_HOVER);
            background.lineStyle(0.5, MENU_COLOR.OUTLINE);
            background.drawRect(0, 0, width, height);
        };
        setStyleNormal();

        this.interactive = true;
        this.buttonMode = true;
        this.on('mouseover', setStyleHover);
        this.on('mouseout', setStyleNormal);
    }
}
