import * as PIXI from "pixi.js";
import {Generator} from "./ui/Generator";
import {
    binaryBlockFactory,
    declarationFactory,
    ifBlockFactory,
    intBlockFactory,
    multiplyBlockFactory,
    noBlockFactory,
    printStingBlockFactory,
    startSignalFactory,
    tenBlockFactory,
    yesBlockFactory
} from "./ui/blocks";

import {FlowControl} from "./ui/flow";
import {AttachController, Offset} from "./controllers/AttachController";
import {FlowController} from "./controllers/FlowController";
import {LogicController} from "./controllers/LogicController";

const MENU_PADDING = 20;
const TEXT_PADDING = 14;

class TextButton extends PIXI.Container {
    private text: PIXI.Text;
    private background: PIXI.Graphics;

    constructor(msg: string, color: number=0xFFFFFF) {
        super();

        this.text = new PIXI.Text(msg);
        this.text.x = TEXT_PADDING;
        this.text.y = TEXT_PADDING;

        let backgroundWidth = this.text.width + TEXT_PADDING*2;
        let backgroundHeight = this.text.height + TEXT_PADDING*2;

        this.background = new PIXI.Graphics();
        this.background.lineStyle(1);
        this.background.beginFill(color);
        this.background.drawRect(0, 0, backgroundWidth, backgroundHeight);
        this.background.hitArea = new PIXI.Rectangle(0, 0, backgroundWidth, backgroundHeight);

        this.addChild(this.background);
        this.addChild(this.text);

        this.interactive = true;
        this.buttonMode = true;
    }
}

export class Global {
    private static _instance:Global = new Global();
    // logic related
    static generators: Array<PIXI.Container>;
    static attachController: AttachController;
    static flowController: FlowController;
    static logicController: LogicController;

    // render related
    static renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    static stage: PIXI.Container;
    static menu: PIXI.Graphics;
    static runButton: TextButton;
    static menuHeight: number;  // TODO: menuHeight should not be here

    private static _dragging: FlowControl | null = null;
    private static dragOffset: Offset = {offsetX: 0, offsetY: 0};

    private constructor() {
        // logic initialization
        Global.generators = [
            new Generator(startSignalFactory),
            new Generator(ifBlockFactory),
            new Generator(declarationFactory),
            new Generator(intBlockFactory),
            new Generator(tenBlockFactory),
            new Generator(multiplyBlockFactory),
            new Generator(yesBlockFactory),
            new Generator(noBlockFactory),
            new Generator(printStingBlockFactory),
            new Generator(binaryBlockFactory),
        ];

        Global.attachController = new AttachController();
        Global.flowController = new FlowController();
        Global.logicController = new LogicController();

        // render initialization
        Global.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: false, resolution: 2}
        );

        Global.renderer.backgroundColor = 0xECEFF1;
        Global.renderer.view.style.position = "absolute";
        Global.renderer.view.style.display = "block";
        Global.renderer.autoResize = true;

        document.body.appendChild(Global.renderer.view);

        Global.stage = new PIXI.Container();

        Global.menu = new PIXI.Graphics();
        Global.stage.addChild(Global.menu);

        Global.runButton = new TextButton("RUN", 0xE0F2F1);
        Global.runButton.on("click", function () {
            let code = Global.logicController.generateCode();
            eval(code);
        });
        Global.stage.addChild(Global.runButton);

        {
            let maxHeight = 0;
            for (let generator of Global.generators) {
                Global.menu.addChild(generator);
                maxHeight = Math.max(maxHeight, generator.height);
            }

            Global.menuHeight = maxHeight + 2*MENU_PADDING;

            let widthSum = 0;
            for (let i = 0; i < Global.generators.length; i++) {
                let generator = Global.generators[i];
                generator.x = (i+1)*MENU_PADDING + widthSum + generator.width * .5;
                generator.y = Global.menuHeight * .5 + generator.height * .5;
                widthSum += generator.width;
            }
        }

        window.addEventListener('resize', this.drawMenu, true);
        this.drawMenu();
    }

    static get instance() {
        return this._instance || (this._instance = new Global());
    }

    static get dragging() {
        return Global._dragging;
    }

    static setDragging(target: FlowControl | null, pivotX?: number, pivotY?: number) {
        if (target) {
            Global._dragging = target;

            pivotX = pivotX || target.x;
            pivotY = pivotY || target.y;

            Global.dragOffset = {
                offsetX: Global.renderer.plugins.interaction.mouse.global.x - pivotX,
                offsetY: Global.renderer.plugins.interaction.mouse.global.y - pivotY,
            };
        } else {
            Global._dragging = null;
        }
    }

    private drawMenu() {
        Global.menu.clear();
        Global.menu.beginFill(0xCFD8DC);
        Global.menu.drawRect(0, 0, window.innerWidth, Global.menuHeight);
        Global.menu.endFill();

        Global.renderer.resize(window.innerWidth, window.innerHeight);

        Global.runButton.x = MENU_PADDING;
        Global.runButton.y = window.innerHeight - Global.runButton.height - MENU_PADDING;
    }

    update() {
        if (Global._dragging) {
            let target = Global._dragging;
            target.x = Global.renderer.plugins.interaction.mouse.global.x - Global.dragOffset.offsetX;
            target.y = Global.renderer.plugins.interaction.mouse.global.y - Global.dragOffset.offsetY;

            target.updateAndGetBounds();

            let attachInfo = Global.attachController.getNearestAttachPoint(
                target.x, target.y,
                target.attachFilter.bind(target)
            );

            if (attachInfo) {
                Global.attachController.setHighlight(attachInfo);
            } else {
                Global.attachController.removeHighlight();
            }
        }

        Global.renderer.render(Global.stage);
    }
}

let state = Global.instance;

function loop() {
    requestAnimationFrame(loop);
    state.update();
}

loop();