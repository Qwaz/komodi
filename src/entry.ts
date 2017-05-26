import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import * as _ from "lodash";
import {Control} from "./controls";
import {enableHighlight, getMousePoint, moveToTop, stagePositionOf} from "./utils";
import {activeBlocks} from "./blockDefinition";
import {AttachManager} from "./managers/AttachManager";
import {Offset} from "./common";
import {GlobalManager} from "./managers/GlobalManager";
import {IconButton, Icons} from "./ui/IconButton";
import {InteractiveRect} from "./ui/InteractiveRect";
import {UPDATE_SHAPE} from "./ui/customEvents";

const MODAL_NODE_ID = "modal";

const MENU_PADDING = 12;

const MENU_RADIUS = 34;
const MENU_FONT_SIZE = 38;

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

    static runButton: IconButton;
    static trashButton: IconButton;

    private static _dragging: Control | null = null;
    private static dragOffset: Offset = {offsetX: 0, offsetY: 0};

    private static backgroundDragging: boolean = false;
    private static backgroundPrevPoint: PIXI.Point = new PIXI.Point();

    private constructor() {
        // parser initialization
        Global.generators = _(activeBlocks).map(
            (factory) => {
                let generator = new factory.generator(factory);
                generator.on(UPDATE_SHAPE, () => {
                    this.updateGenerators();
                });
                return generator;
            }
        ).value();

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

        Global.runButton = new IconButton(Icons.PLAY, {
            radius: MENU_RADIUS,
            fontSize: MENU_FONT_SIZE,
            fontColor: 0xFFFFFF,
            color: 0x2196F3
        });
        enableHighlight(Global.runButton);
        Global.runButton.on("click", function () {
            let code = Global.globalManager.generateCode();
            console.log(code);
            eval(code);
        });
        Global.fixed.addChild(Global.runButton);

        Global.trashButton = new IconButton(Icons.TRASH, {
            radius: MENU_RADIUS,
            fontSize: MENU_FONT_SIZE,
            fontColor: 0xFFFFFF,
            color: 0x757575
        });
        Global.fixed.addChild(Global.trashButton);

        for (let generator of Global.generators) {
            Global.menu.addChild(generator);
        }

        this.updateGenerators();

        Global.renderer.plugins.interaction.on('mousedown', function (e: PIXI.interaction.InteractionEvent) {
            if (!e.target) {
                Global.backgroundDragging = true;
                Global.backgroundPrevPoint = getMousePoint();
            }
        });

        Global.renderer.plugins.interaction.on('mouseup', function () {
            if (Global.dragging) {
                Control.mouseupHandler(Global.dragging);
            }

            Global.backgroundDragging = false;
        });

        window.addEventListener('resize', this.updatePosition, true);
        this.updatePosition();
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

            let stagePosition = stagePositionOf(target);
            pivotX = pivotX || stagePosition.x;
            pivotY = pivotY || stagePosition.y;

            let mouse = getMousePoint();

            Global.dragOffset = {
                offsetX: mouse.x - pivotX,
                offsetY: mouse.y - pivotY,
            };
        } else {
            Global._dragging = null;
        }
    }

    private static gui: any;

    // TODO: update any type
    static showModal(newGui: any) {
        let modalNode = document.getElementById(MODAL_NODE_ID);

        if (modalNode) {
            if (Global.gui !== undefined) {
                modalNode.removeChild(Global.gui.domElement);
                Global.gui.destroy();
            }
            Global.gui = newGui;

            modalNode.appendChild(Global.gui.domElement);
            modalNode.classList.add("active");
        }
    }

    private updateGenerators() {
        let top = 0, bottom = 0;
        for (let generator of Global.generators) {
            let localBounds = generator.getLocalBounds();
            top = Math.min(top, localBounds.top);
            bottom = Math.max(bottom, localBounds.bottom);
        }

        let widthSum = 0;
        for (let i = 0; i < Global.generators.length; i++) {
            let generator = Global.generators[i];
            generator.x = (i+1)*MENU_PADDING + widthSum + generator.width * .5;
            generator.y = -top + MENU_PADDING;
            widthSum += generator.width;
        }

        Global.menu.updateHeight(bottom-top + 2*MENU_PADDING);
    }

    private updatePosition() {
        Global.menu.updateWidth(window.innerWidth);

        Global.renderer.resize(window.innerWidth, window.innerHeight);

        Global.runButton.x = MENU_PADDING + Global.runButton.width*.5;
        Global.runButton.y = window.innerHeight - MENU_PADDING - Global.runButton.height*.5;

        Global.trashButton.x = MENU_PADDING + Global.trashButton.width*.5;
        Global.trashButton.y = Global.runButton.y - MENU_PADDING - Global.trashButton.height;
    }

    update() {
        if (Global._dragging) {
            let mouse = getMousePoint();

            let target = Global._dragging;
            target.x = mouse.x - Global.dragOffset.offsetX;
            target.y = mouse.y - Global.dragOffset.offsetY;

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

        if (Global.backgroundDragging) {
            let prevMouse = Global.backgroundPrevPoint;
            let nowMouse = getMousePoint();

            Global.stage.x += nowMouse.x - prevMouse.x;
            Global.stage.y += nowMouse.y - prevMouse.y;
            Global.backgroundPrevPoint = nowMouse;
        }

        Global.renderer.render(Global.container);
    }
}

let modalNode = document.createElement("div");
modalNode.id = MODAL_NODE_ID;
modalNode.classList.add("modalDialog");
document.body.appendChild(modalNode);

let styleNode = document.createElement("style");
styleNode.type = 'text/css';
styleNode.appendChild(document.createTextNode(`
    .modalDialog {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
        z-index: 99999;
        opacity:0;
        -webkit-transition: opacity 300ms ease-in;
        -moz-transition: opacity 300ms ease-in;
        transition: opacity 300ms ease-in;
        pointer-events: none;
    }
    
    .modalDialog.active {
        opacity:1;
        pointer-events: auto;
    }
    
    .modalDialog > div {
        margin-top: 10%;
        margin-left: auto;
        margin-right: auto;
    }
`));
document.head.appendChild(styleNode);

window.addEventListener("click", (e: MouseEvent) => {
    if (e.target === modalNode) {
        modalNode.classList.remove("active");
    }
});

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
