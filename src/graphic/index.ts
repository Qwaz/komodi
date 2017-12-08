import {Block, BlockBase, BlockClass, VirtualBlock} from "../program/index";
import {Komodi} from "../global";
import {BlockDefinition, Token, UserInputToken} from "../program/definition_parser";
import {typeToColor} from "../type";
import {getMousePoint} from "../common/utils";

class UserInputTokenGraphic extends PIXI.Container {
    private graphics: PIXI.Graphics;

    constructor(target: BlockBase, private token: UserInputToken) {
        super();

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        if (target instanceof Block) {
            this.interactive = true;
            this.buttonMode = true;

            let prevMouse = new PIXI.Point();
            this.on('mousedown', () => {
                prevMouse = getMousePoint();
            });
            this.on('mouseup', () => {
                let currentMouse = getMousePoint();
                if (prevMouse.x == currentMouse.x && prevMouse.y == currentMouse.y) {
                    let result = token.validator.updateInput(target.getInput(token.identifier));
                    if (result != null) {
                        (<any>target)[token.identifier] = result;
                        target.updateGraphic();
                    }
                }
            });
        }
    }

    updateSize(width: number, height: number) {
        this.graphics.clear();
        this.graphics.beginFill(typeToColor(this.token.validator.type));
        this.graphics.lineStyle(1, 0);
        this.graphics.drawRoundedRect(0, 0, width, height, 9);
    }
}

export abstract class BlockGraphicBase extends PIXI.Container {
    readonly graphics: PIXI.Graphics = new PIXI.Graphics();

    labels: PIXI.Text[] = [];
    userInputTokens: (UserInputTokenGraphic | null)[] = [];

    constructor(readonly logic: BlockBase) {
        super();

        this.addChild(this.graphics);
        this.interactive = true;

        logic.definition.tokens.forEach((token: Token) => {
            if (token.kind == "user_input") {
                let tokenGraphic = new UserInputTokenGraphic(logic, token);
                this.userInputTokens.push(tokenGraphic);
                this.addChild(tokenGraphic);
            } else {
                this.userInputTokens.push(null);
            }

            let label = new PIXI.Text("", {
                fontSize: 14, align : 'center'
            });
            this.labels.push(label);
            this.addChild(label);
        });
    }

    destroy() {
        this.labels.forEach((label) => label.destroy());
        this.userInputTokens.forEach((token) => {
            if (token) token.destroy()
        });
        super.destroy();
    }

    abstract update(): void;
}

export class BlockGenerator extends BlockGraphicBase {
    readonly definition: BlockDefinition;

    constructor(public readonly blockClass: BlockClass) {
        super(new VirtualBlock(blockClass));
        this.logic.graphic = this;

        this.definition = blockClass.definition;
        this.buttonMode = true;

        this.on('mousedown', (e: PIXI.interaction.InteractionEvent) => {
            if (Komodi.module.editingModule) {
                let globalPosition = this.getGlobalPosition();

                let block = new blockClass();
                block.init(Komodi.module.editingModule);

                Komodi.fixed.addChild(block.graphic);
                block.graphic.x = globalPosition.x;
                block.graphic.y = globalPosition.y;
                Komodi.attacher.setDragging(block, true);

                e.stopPropagation();
            }
        });

        this.update();
    }

    update() {
        this.graphics.clear();

        this.blockClass.definition.nodeDrawer.drawNode(this.logic, argumentGraphicsGenerator(this.logic));
    }
}

export class BlockGraphic extends BlockGraphicBase {
    constructor(logic: Block) {
        super(logic);

        let prevMouse: PIXI.Point | null = null;
        this.on('mousedown', (e: PIXI.interaction.InteractionEvent) => {
            prevMouse = getMousePoint();
            e.stopPropagation();
        });
        this.on('mousemove', () => {
            if (prevMouse) {
                let currentMouse = getMousePoint();
                if (prevMouse.x != currentMouse.x || prevMouse.y != currentMouse.y) {
                    let position = this.getGlobalPosition();
                    if (logic.attachInfo != null) {
                        logic.attachInfo.target.detachBlock(logic);
                    }

                    Komodi.stage.addChild(this);
                    this.position = Komodi.stage.toLocal(position);
                    Komodi.attacher.setDragging(logic);
                }
            }
        });
        this.on('mouseup', () => {
            prevMouse = null;
        });
    }

    update() {
        this.graphics.clear();

        this.logic.definition.scopeDrawer.drawScope(this.logic, scopeGraphicsGenerator(this.logic));
        this.logic.definition.nodeDrawer.drawNode(this.logic, argumentGraphicsGenerator(this.logic));
    }
}

export abstract class NodeDrawer {
    abstract drawNode(block: BlockBase, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>): void;
}

export abstract class ScopeDrawer {
    abstract drawScope(block: BlockBase, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>): void;
}

function argumentGraphicsGenerator(block: BlockBase) {
    return function *() {
        for (let argumentName of block.definition.argumentNames) {
            let argumentBlock = block.getArgument(argumentName);
            yield argumentBlock == null ? null : argumentBlock.graphic;
        }
    };
}

function scopeGraphicsGenerator(block: BlockBase) {
    return function *() {
        for (let scopeName of block.definition.scopeNames) {
            let scopeBlocks = block.getScope(scopeName)!;
            yield (function *() {
                for (let block of scopeBlocks) {
                    yield block.graphic;
                }
            })();
        }
    };
}
