import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import {Attacher} from "./program/attacher";
import {ConsoleMenu, SideMenu, TopMenu} from "./menu";
import {deserializeProgram, serializeProgram} from "./program/serializer";
import {BlockGraphic} from "./graphic/index";

const KOMODI_STYLE = `
.komodi-container {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
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

class KomodiClass {
    readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;

    private komodiDiv: HTMLDivElement;

    readonly container: PIXI.Container = new PIXI.Container();
    readonly stage: PIXI.Container = new PIXI.Container();
    readonly fixed: PIXI.Container = new PIXI.Container();
    private background: PIXI.Graphics = new PIXI.Graphics();

    topMenu: TopMenu = new TopMenu();
    sideMenu: SideMenu = new SideMenu();
    bottomMenu: ConsoleMenu = new ConsoleMenu();

    attacher: Attacher = new Attacher();

    constructor() {
        this.komodiDiv = document.createElement("div");
        this.komodiDiv.classList.add("komodi-container");

        this.container.interactive = true;
        this.container.addChild(this.stage, this.fixed, this.background);

        this.background.alpha = 0;

        this.fixed.interactive = true;
        this.fixed.addChild(this.sideMenu, this.bottomMenu, this.topMenu);

        // setup top menu
        this.topMenu.addMenu('Open', () => {
            if (window.confirm('Current progress will be lost')) {
                let fakeInput = document.createElement('input');
                fakeInput.setAttribute('type', 'file');
                fakeInput.setAttribute('accept', '.komodi');
                fakeInput.click();
                fakeInput.addEventListener('change', () => {
                    if (fakeInput.files && fakeInput.files[0]) {
                        let file = fakeInput.files[0];

                        // TODO: contents validation
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            this.clearStage();
                            this.topMenu.projectName = file.name.slice(0, -7);
                            deserializeProgram(JSON.parse(reader.result));
                        };
                        reader.readAsText(file);
                    }
                });
            }
        });

        this.topMenu.addMenu('Save', () => {
            let serialized = serializeProgram(),
                blob = new Blob([JSON.stringify(serialized)], {type: 'octet/stream'}),
                url = URL.createObjectURL(blob);
            let fakeLink = document.createElement('a');
            fakeLink.href = url;
            fakeLink.download = this.topMenu.projectName + '.komodi';
            fakeLink.click();
            URL.revokeObjectURL(url);
        });

        // renderer initialization
        this.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: true, resolution: 2}
        );
    }

    init() {
        this.attacher.init();
    }

    clearStage() {
        for (let index = this.stage.children.length-1; index >= 0; index--) {
            let child = this.stage.getChildAt(index);
            if (child instanceof BlockGraphic) {
                child.logic.destroy();
            }
        }
    }

    initializeDOM(parent: HTMLElement) {
        let resize = () => {
            let screenWidth = parent.clientWidth;
            let screenHeight = parent.clientHeight;

            this.renderer.resize(screenWidth, screenHeight);
            this.background.clear();
            this.background.drawRect(0, 0, screenWidth, screenHeight);

            this.topMenu.update(screenWidth, screenHeight);
            this.sideMenu.update(screenWidth, screenHeight);
            this.bottomMenu.update(screenWidth, screenHeight);
        };

        this.renderer.autoResize = true;
        this.komodiDiv.appendChild(this.renderer.view);
        parent.appendChild(this.komodiDiv);

        window.addEventListener('resize', resize, true);
        resize();

        let styleNode = document.createElement("style");
        styleNode.type = 'text/css';
        styleNode.appendChild(document.createTextNode(KOMODI_STYLE));
        document.head.appendChild(styleNode);
    }

    start() {
        let update = () => {
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
Komodi.init();
