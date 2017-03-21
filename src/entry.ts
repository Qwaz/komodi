import {Block, BlockGenerator} from "./ui/block";

export class State {
    private static _instance:State = new State();

    static renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;

    static stage: PIXI.Container;
    static menu: PIXI.Graphics;

    static freeBlocks: Set<Block>;

    static dragging: Block | null = null;

    private constructor() {
        State.renderer = PIXI.autoDetectRenderer(
            1, 1,
            {antialias: true, transparent: false, resolution: 1}
        );

        State.renderer.backgroundColor = 0xecf0f1;
        State.renderer.view.style.position = "absolute";
        State.renderer.view.style.display = "block";
        State.renderer.autoResize = true;

        //Add the canvas to the HTML document
        document.body.appendChild(State.renderer.view);

        State.stage = new PIXI.Container();
        State.freeBlocks = new Set<Block>();

        State.menu = new PIXI.Graphics();
        State.stage.addChild(State.menu);

        let purpleBlock = new BlockGenerator(0x9b59b6);
        purpleBlock.x = 80;
        purpleBlock.y = 55;

        let orangeBlock = new BlockGenerator(0xe67e22);
        orangeBlock.x = 220;
        orangeBlock.y = 55;

        State.menu.addChild(purpleBlock);
        State.menu.addChild(orangeBlock);

        window.addEventListener('resize', this.drawMenu, true);
        this.drawMenu();

        function gameLoop() {
            requestAnimationFrame(gameLoop);

            if (State.dragging) {
                State.dragging.position = State.renderer.plugins.interaction.mouse.global;
                State.dragging.adjustChildrenPosition();

                State.freeBlocks.forEach((block) => {
                    block.highlight = block.possibleNextBlock(State.dragging);
                });
            }

            State.renderer.render(State.stage);
        }

        State.renderer.render(State.stage);
        gameLoop();
    }

    public static get instance() {
        return this._instance || (this._instance = new State());
    }

    private drawMenu() {
        const MENU_HEIGHT = 120;

        State.renderer.resize(window.innerWidth, window.innerHeight);

        State.menu.clear();
        State.menu.beginFill(0xbdc3c7);
        State.menu.drawRect(0, 0, window.innerWidth, MENU_HEIGHT);
        State.menu.endFill();
    }

    update() {
        State.renderer.render(State.stage);
    }
}

let state = State.instance;

function loop() {
    requestAnimationFrame(loop);
    state.update();
}

loop();