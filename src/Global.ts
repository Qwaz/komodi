import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import {Control} from "./controls";
import {enableHighlight, getMousePoint, moveToTop, stagePositionOf} from "./utils";
import {AttachManager} from "./managers/AttachManager";
import {Offset} from "./common";
import {GlobalManager} from "./managers/GlobalManager";
import {IconButton, Icons} from "./ui/IconButton";
import {SideMenu, SideMenuInfo} from "./ui/sideMenu";

const KOMODI_STYLE = `
.modal-dialog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99999;
    opacity:0;
    -webkit-transition: opacity 180ms ease-in;
    -moz-transition: opacity 180ms ease-in;
    transition: opacity 180ms ease-in;
    pointer-events: none;
}

.modal-dialog.active {
    opacity:1;
    pointer-events: auto;
}

.modal-dialog > div {
    margin-top: 10%;
    margin-left: auto;
    margin-right: auto;
}

.komodi-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        rgba(0, 0, 0, .15) 25%,
        rgba(0, 0, 0, .15) 26%,
        transparent 27%,
        transparent 74%,
        rgba(0, 0, 0, .15) 75%,
        rgba(0, 0, 0, .15) 76%,
        transparent 77%, transparent
    ), linear-gradient(
        90deg,
        transparent 24%,
        rgba(0, 0, 0, .15) 25%,
        rgba(0, 0, 0, .15) 26%,
        transparent 27%,
        transparent 74%,
        rgba(0, 0, 0, .15) 75%,
        rgba(0, 0, 0, .15) 76%,
        transparent 77%,
        transparent
    );
    background-size:50px 50px;
}`;

const MODAL_NODE_ID = "komodi-modal";

const MENU_PADDING = 12;

const MENU_RADIUS = 34;
const MENU_FONT_SIZE = 38;

class KomodiClass {
    // drag related
    private _dragging: Control | null = null;
    private dragOffset: Offset = {offsetX: 0, offsetY: 0};

    private backgroundDragging: boolean = false;
    private backgroundPrevPoint: PIXI.Point = new PIXI.Point();

    get dragging() {
        return this._dragging;
    }

    readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;

    readonly attachManager = new AttachManager();
    readonly globalManager = new GlobalManager();

    private komodiDiv: HTMLDivElement;

    private container: PIXI.Container;
    readonly stage: PIXI.Container;
    private fixed: PIXI.Container;

    readonly runButton: IconButton;
    readonly trashButton: IconButton;

    constructor() {
        this.komodiDiv = document.createElement("div");
        this.komodiDiv.classList.add("komodi-container");

        this.container = new PIXI.Container();

        this.stage = new PIXI.Container();
        this.fixed = new PIXI.Container();
        this.fixed.interactive = true;

        this.container.addChild(this.stage);
        this.container.addChild(this.fixed);

        // other ui setup
        this.runButton = new IconButton(Icons.PLAY, {
            radius: MENU_RADIUS,
            fontSize: MENU_FONT_SIZE,
            fontColor: 0xFFFFFF,
            color: 0x2196F3
        });
        enableHighlight(this.runButton);
        this.runButton.on("click", () => {
            let code = this.globalManager.generateCode();
            console.log(code);
            eval(code);
        });
        this.fixed.addChild(this.runButton);

        this.trashButton = new IconButton(Icons.TRASH, {
            radius: MENU_RADIUS,
            fontSize: MENU_FONT_SIZE,
            fontColor: 0xFFFFFF,
            color: 0x757575
        });
        this.fixed.addChild(this.trashButton);

        // renderer initialization
        this.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: true, resolution: 2}
        );

        this.renderer.plugins.interaction.on('mousedown', (e: PIXI.interaction.InteractionEvent) => {
            if (!e.target) {
                this.backgroundDragging = true;
                this.backgroundPrevPoint = getMousePoint();
            }
        });

        this.renderer.plugins.interaction.on('mouseup', () => {
            if (this._dragging) {
                Control.mouseupHandler(this._dragging);
            }

            this.backgroundDragging = false;
        });
    }

    setDragging(target: Control | null, pivotX?: number, pivotY?: number) {
        if (target) {
            this._dragging = target;
            moveToTop(target);

            let stagePosition = stagePositionOf(target);
            pivotX = pivotX || stagePosition.x;
            pivotY = pivotY || stagePosition.y;

            let mouse = getMousePoint();

            this.dragOffset = {
                offsetX: mouse.x - pivotX,
                offsetY: mouse.y - pivotY,
            };
        } else {
            this._dragging = null;
        }
    }

    // TODO: update any type
    private gui: any;

    showModal(newGui: any) {
        let modalNode = document.getElementById(MODAL_NODE_ID);

        if (modalNode) {
            if (this.gui !== undefined) {
                modalNode.removeChild(this.gui.domElement);
                this.gui.destroy();
            }
            this.gui = newGui;

            modalNode.appendChild(this.gui.domElement);
            modalNode.classList.add("active");

            let input = this.gui.domElement.querySelector("input") as HTMLInputElement;
            input.select();
            input.addEventListener("blur", () => modalNode!.classList.remove("active"));
        }
    }

    // external API
    setBlocks(sideMenuInfo: SideMenuInfo[]) {
        let sideMenu = new SideMenu(sideMenuInfo);
        this.fixed.addChild(sideMenu);
    }

    initializeDOM(parent: HTMLElement) {
        let updatePosition = () => {
            this.renderer.resize(parent.clientWidth, parent.clientHeight);

            this.runButton.x = MENU_PADDING + this.runButton.width*.5;
            this.runButton.y = window.innerHeight - MENU_PADDING - this.runButton.height*.5;

            this.trashButton.x = MENU_PADDING + this.trashButton.width*.5;
            this.trashButton.y = this.runButton.y - MENU_PADDING - this.trashButton.height;
        };

        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.view.style.top = "0";
        this.renderer.view.style.left = "0";
        this.renderer.autoResize = true;
        this.komodiDiv.appendChild(this.renderer.view);
        parent.appendChild(this.komodiDiv);

        window.addEventListener('resize', updatePosition, true);
        updatePosition();

        let modalNode = document.createElement("div");
        modalNode.id = MODAL_NODE_ID;
        modalNode.classList.add("modal-dialog");
        document.body.appendChild(modalNode);

        let styleNode = document.createElement("style");
        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(KOMODI_STYLE));
        document.head.appendChild(styleNode);

        window.addEventListener("click", (e: MouseEvent) => {
            if (e.target === modalNode) {
                modalNode.classList.remove("active");
            }
        });
    }

    start() {
        let update = () => {
            if (this._dragging) {
                let mouse = getMousePoint();

                let target = this._dragging;
                target.x = mouse.x - this.dragOffset.offsetX;
                target.y = mouse.y - this.dragOffset.offsetY;

                let attachInfo = this.attachManager.getNearestAttachPoint(
                    target.x, target.y,
                    target.attachFilter.bind(target)
                );

                if (attachInfo) {
                    this.attachManager.setHighlight(attachInfo);
                } else {
                    this.attachManager.removeHighlight();
                }
            }

            if (this.backgroundDragging) {
                let prevMouse = this.backgroundPrevPoint;
                let nowMouse = getMousePoint();

                this.stage.x += nowMouse.x - prevMouse.x;
                this.stage.y += nowMouse.y - prevMouse.y;
                this.backgroundPrevPoint = nowMouse;
            }

            this.renderer.render(this.container);
        };

        WebFont.load({
            custom: {
                families: ['FontAwesome'],
                testStrings: {
                    'FontAwesome': '\uF13b'
                },
            },
            active: function() {
                function loop() {
                    requestAnimationFrame(loop);
                    update();
                }

                loop();
            },
            inactive: function() {
                alert("Komodi initialization failed");
            },
        });
    }
}

export const Komodi = new KomodiClass();