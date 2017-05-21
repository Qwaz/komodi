import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {Generator} from "./ui/Generator";
import {Control} from "./controls";
import {enableHighlight, globalPositionOf, moveToTop} from "./utils";
import {activeBlocks} from "./blockDefinition";
import {AttachManager} from "./managers/AttachManager";
import {Offset} from "./common";
import {GlobalManager} from "./managers/GlobalManager";
import {IconButton, Icons} from "./ui/IconButton";
import {InteractiveRect} from "./ui/InteractiveRect";

const MENU_PADDING = 12;

export class Global {
    private static _instance:Global = new Global();
    // parser related
    static generators: Array<PIXI.Container>;
    static attachManager: AttachManager;
    static globalManager: GlobalManager;

    // render related
    static renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    private static container: PIXI.Container;
    static stage: PIXI.Container;
    static fixed: PIXI.Container;

    static menu: InteractiveRect;
    static menuHeight: number;  // TODO: revise design

    static runButton: IconButton;
    static trashButton: IconButton;

    private static _dragging: Control | null = null;
    private static dragOffset: Offset = {offsetX: 0, offsetY: 0};

    private constructor() {
        // parser initialization
        Global.generators = _(activeBlocks).map((factory) => new Generator(factory)).value();

        Global.attachManager = new AttachManager();
        Global.globalManager = new GlobalManager();

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

        Global.container = new PIXI.Container();

        Global.stage = new PIXI.Container();
        Global.fixed = new PIXI.Container();
        Global.fixed.interactive = true;
        Global.container.addChild(Global.stage);
        Global.container.addChild(Global.fixed);

        Global.menu = new InteractiveRect(0xCFD8DC);
        Global.fixed.addChild(Global.menu);

        Global.runButton = new IconButton(Icons.PLAY, 0x2196F3);
        enableHighlight(Global.runButton);
        Global.runButton.on("click", function () {
            let code = Global.globalManager.generateCode();
            console.log(code);
            eval(code);
        });
        Global.fixed.addChild(Global.runButton);

        Global.trashButton = new IconButton(Icons.TRASH, 0x757575);
        Global.fixed.addChild(Global.trashButton);

        Global.fixed.on("mouseup", function () {
            if (Global.dragging) {
                Control.mouseupHandler(Global.dragging);
            }
        });

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

    static setDragging(target: Control | null, pivotX?: number, pivotY?: number) {
        if (target) {
            Global._dragging = target;
            moveToTop(target);

            let globalPosition = globalPositionOf(target);
            pivotX = pivotX || globalPosition.x;
            pivotY = pivotY || globalPosition.y;

            Global.dragOffset = {
                offsetX: Global.renderer.plugins.interaction.mouse.global.x - pivotX,
                offsetY: Global.renderer.plugins.interaction.mouse.global.y - pivotY,
            };
        } else {
            Global._dragging = null;
        }
    }

    private drawMenu() {
        Global.menu.updateRegion(new PIXI.Rectangle(0, 0, window.innerWidth, Global.menuHeight));

        Global.renderer.resize(window.innerWidth, window.innerHeight);

        Global.runButton.x = MENU_PADDING + Global.runButton.width*.5;
        Global.runButton.y = window.innerHeight - MENU_PADDING - Global.runButton.height*.5;

        Global.trashButton.x = MENU_PADDING + Global.trashButton.width*.5;
        Global.trashButton.y = Global.runButton.y - MENU_PADDING - Global.trashButton.height;
    }

    update() {
        if (Global._dragging) {
            let target = Global._dragging;
            target.x = Global.renderer.plugins.interaction.mouse.global.x - Global.dragOffset.offsetX;
            target.y = Global.renderer.plugins.interaction.mouse.global.y - Global.dragOffset.offsetY;

            let attachInfo = Global.attachManager.getNearestAttachPoint(
                target.x, target.y,
                target.attachFilter.bind(target)
            );

            if (attachInfo) {
                Global.attachManager.setHighlight(attachInfo);
            } else {
                Global.attachManager.removeHighlight();
            }
        }

        Global.renderer.render(Global.container);
    }
}

WebFont.load({
    custom: {
        families: ['FontAwesome'],
        testStrings: {
            'FontAwesome': '\uF13b'
        },
    },
    active: function() {
        let state = Global.instance;

        function loop() {
            requestAnimationFrame(loop);
            state.update();
        }

        loop();
    },
    inactive: function() {
        alert("Oh No!");
    },
});
