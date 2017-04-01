import {Generator} from "./ui/Generator";
import {binaryBlockFactory, orangeBlockFactory, purpleBlockFactory, smallBlockFactory} from "./ui/blocks";
import {Block, FlowItem} from "./ui/flow";
import {AttachController} from "./controllers/AttachController";

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
    static menuHeight: number;  // TODO: menuHight should not be here

    static dragging: FlowItem | null = null;

    private constructor() {
        // logic initialization
        Global.generators = [
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
                generator.y = Global.menuHeight * .5;
                widthSum += generator.width;
            }
        }

        window.addEventListener('resize', this.drawMenu, true);
        this.drawMenu();
    }

    public static get instance() {
        return this._instance || (this._instance = new Global());
    }

    private drawMenu() {
        Global.menu.clear();
        Global.menu.beginFill(0xbdc3c7);
        Global.menu.drawRect(0, 0, window.innerWidth, Global.menuHeight);
        Global.menu.endFill();

        Global.renderer.resize(window.innerWidth, window.innerHeight);
    }

    update() {
        if (Global.dragging) {
            let target = Global.dragging;
            target.position = Global.renderer.plugins.interaction.mouse.global;

            if (target instanceof Block) {
                target.updateChildrenPosition();

                let attachInfo = Global.attachController.getNearestAttachPoint(
                    target.x + target.shape.pivot.offsetX,
                    target.y + target.shape.pivot.offsetY,
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