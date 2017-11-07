import * as WebFont from "webfontloader";

import * as PIXI from "pixi.js";
import {Program} from "./program/index";
import {CmdIfElse} from "./program/lib/common";
import {CmdPrintLine} from "./program/lib/io";
import {ExpCompareString, ExpConstantString} from "./program/lib/string";

const KOMODI_STYLE = `
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

class KomodiClass {
    readonly renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;

    private komodiDiv: HTMLDivElement;

    private container: PIXI.Container;
    readonly stage: PIXI.Container;
    private fixed: PIXI.Container;

    tmpProgram: Program;

    constructor() {
        this.komodiDiv = document.createElement("div");
        this.komodiDiv.classList.add("komodi-container");

        this.container = new PIXI.Container();

        this.stage = new PIXI.Container();
        this.fixed = new PIXI.Container();
        this.fixed.interactive = true;

        this.container.addChild(this.stage);
        this.container.addChild(this.fixed);

        // temporary program
        {
            let ifElse = new CmdIfElse();
            ifElse.attachBlock({
                attachType: "argument",
                target: ifElse,
                argumentName: "condition"
            }, new ExpCompareString());

            ifElse.attachBlock({
                attachType: "scope",
                target: ifElse,
                scopeName: "ifBranch",
                scopeIndex: 0
            }, new CmdPrintLine());

            ifElse.attachBlock({
                attachType: "scope",
                target: ifElse,
                scopeName: "ifBranch",
                scopeIndex: 1
            }, new CmdPrintLine());

            ifElse.attachBlock({
                attachType: "scope",
                target: ifElse,
                scopeName: "elseBranch",
                scopeIndex: 0
            }, new CmdPrintLine());

            ifElse.attachBlock({
                attachType: "scope",
                target: ifElse,
                scopeName: "elseBranch",
                scopeIndex: 1
            }, new CmdPrintLine());

            let cmd2 = new CmdPrintLine();
            ifElse.attachBlock({
                attachType: "scope",
                target: ifElse,
                scopeName: "elseBranch",
                scopeIndex: 2
            }, cmd2);

            cmd2.attachBlock({
                attachType: "argument",
                target: cmd2,
                argumentName: "str"
            }, new ExpConstantString());

            ifElse.updateGraphic();

            this.stage.addChild(ifElse.graphic);
            ifElse.graphic.x = 300;
            ifElse.graphic.y = 100;
        }

        // renderer initialization
        this.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: true, resolution: 2}
        );
    }

    initializeDOM(parent: HTMLElement) {
        let updatePosition = () => {
            this.renderer.resize(parent.clientWidth, parent.clientHeight);
        };

        this.renderer.autoResize = true;
        this.komodiDiv.appendChild(this.renderer.view);
        parent.appendChild(this.komodiDiv);

        window.addEventListener('resize', updatePosition, true);
        updatePosition();

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
