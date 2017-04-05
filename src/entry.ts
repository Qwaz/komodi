import {Generator} from "./ui/Generator";
import {
    binaryBlockFactory,
    orangeBlockFactory,
    purpleBlockFactory,
    smallBlockFactory,
    startSignalFactory
} from "./ui/blocks";
import {Block, FlowItem} from "./ui/flow";
import {AttachController, Offset} from "./controllers/AttachController";

const MENU_PADDING = 20;

export class Global {
    private static _instance:Global = new Global();

    // logic related
    static generators: Array<PIXI.Container>;
    static attachController: AttachController;

    // render related
    static renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    static stage: PIXI.Container;
    static menu: PIXI.Graphics;
    static menuHeight: number;  // TODO: menuHeight should not be here

    private static _dragging: FlowItem | null = null;
    private static dragOffset: Offset = {offsetX: 0, offsetY: 0};

    private constructor() {
        // logic initialization
        Global.generators = [
            new Generator(startSignalFactory),
            new Generator(smallBlockFactory),
            new Generator(purpleBlockFactory),
            new Generator(orangeBlockFactory),
            new Generator(binaryBlockFactory),
        ];

        Global.attachController = new AttachController();

        // render initialization
        Global.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: false, transparent: false, resolution: 1}
        );

        Global.renderer.backgroundColor = 0xecf0f1;
        Global.renderer.view.style.position = "absolute";
        Global.renderer.view.style.display = "block";
        Global.renderer.autoResize = true;

        document.body.appendChild(Global.renderer.view);

        Global.stage = new PIXI.Container();

        Global.menu = new PIXI.Graphics();
        Global.stage.addChild(Global.menu);

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

    static setDragging(target: FlowItem | null, pivotX?: number, pivotY?: number) {
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
        Global.menu.beginFill(0xbdc3c7);
        Global.menu.drawRect(0, 0, window.innerWidth, Global.menuHeight);
        Global.menu.endFill();

        Global.renderer.resize(window.innerWidth, window.innerHeight);
    }

    update() {
        if (Global._dragging) {
            let target = Global._dragging;
            target.x = Global.renderer.plugins.interaction.mouse.global.x - Global.dragOffset.offsetX;
            target.y = Global.renderer.plugins.interaction.mouse.global.y - Global.dragOffset.offsetY;

            if (target instanceof Block) {
                target.updateChildrenPosition();

                let attachInfo = Global.attachController.getNearestAttachPoint(
                    target.x,
                    target.y,
                );

                if (attachInfo) {
                    Global.attachController.setHighlight(attachInfo);
                } else {
                    Global.attachController.removeHighlight();
                }
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