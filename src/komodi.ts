import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import {ConsoleMenu, SideMenu, TopMenu} from "./menu";
import {KomodiContext} from "./context";
import {Validator} from "./program/validator";

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

export class KomodiClass extends KomodiContext {
    readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;

    readonly validator = new Validator();

    private komodiDiv: HTMLDivElement;

    readonly topMenu: TopMenu;
    readonly sideMenu: SideMenu;
    readonly consoleMenu: ConsoleMenu;

    constructor() {
        super();

        this.komodiDiv = document.createElement("div");
        this.komodiDiv.classList.add("komodi-container");

        this.topMenu = new TopMenu();
        this.sideMenu = new SideMenu(this);
        this.consoleMenu = new ConsoleMenu();

        this.fixed.addChild(this.sideMenu, this.consoleMenu, this.topMenu);

        // setup top menu
        this.topMenu.addMenu('Project Name', () => {
            let projectName = window.prompt('Project Name:', this.projectName);
            if (!projectName || projectName == '') return;

            this.projectName = projectName;
        });
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
                            this.clearProject();
                            this.serializer.deserializeProgram(JSON.parse(reader.result));
                        };
                        reader.readAsText(file);
                    }
                });
            }
        });

        this.topMenu.addMenu('Save', () => {
            let serialized = this.serializer.serializeProgram(),
                blob = new Blob([JSON.stringify(serialized)], {type: 'octet/stream'}),
                url = URL.createObjectURL(blob);
            let fakeLink = document.createElement('a');
            fakeLink.href = url;
            fakeLink.download = this.projectName + '.komodi';
            fakeLink.click();
            URL.revokeObjectURL(url);
        });

        this.topMenu.addMenu('New Module', () => {
            let moduleName = window.prompt('Please choose module name');
            if (!moduleName || moduleName == '') return;

            if (this.module.checkModuleExist(moduleName, true)) {
                window.alert('Module name already exists!');
            } else {
                this.module.addUserModule(moduleName);
            }
        });

        // renderer initialization
        this.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: true, resolution: 2, roundPixels: true}
        );
    }

    get projectName() {
        return this._projectName;
    }

    set projectName(projectName: string) {
        this._projectName = projectName;
        this.topMenu.projectName = projectName;
    }

    init() {
        super.init();
        this.sideMenu.init();
    }

    newProject() {
        this.projectName = "Untitled Komodi Project";
        this.module.addUserModule('main');
        this.module.editingModule = 'main';
    }

    clearProject() {
        this.module.clear();
        this.consoleMenu.result.text = ConsoleMenu.DEFAULT_RESULT;
    }

    initializeDOM(parent: HTMLElement) {
        let resize = () => {
            let screenWidth = parent.clientWidth;
            let screenHeight = parent.clientHeight;

            this.renderer.resize(screenWidth, screenHeight);

            this.topMenu.update(screenWidth, screenHeight);
            this.sideMenu.update(screenWidth, screenHeight);
            this.consoleMenu.update(screenWidth, screenHeight);
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
        let updateCnt = 0;
        let update = () => {
            this.renderer.render(this.container);

            updateCnt++;
            if (updateCnt == 200) {
                updateCnt = 0;
                this.consoleMenu.result.text = this.validator.validate(
                    this.serializer.serializeProgram()
                );
            }
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
