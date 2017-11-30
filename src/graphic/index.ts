import * as _ from "lodash";
import {KomodiType} from "../type";
import {Block} from "../program/index";
import {Komodi} from "../global";
import {BlockClass} from "../program/lib/index";
import {BlockDefinition} from "../program/definition_parser";

let labelPool: PIXI.Text[] = [];

function getLabel(text: string): PIXI.Text {
    if (labelPool.length == 0) {
        return new PIXI.Text(text, {
            fontSize: 14, align : 'center'
        });
    }
    let label = labelPool.pop()!;
    label.text = text;
    return label;
}

function releaseLabel(label: PIXI.Text) {
    labelPool.push(label);
}

class LabelManager extends PIXI.Container {
    assignedLabels: PIXI.Text[] = [];

    assignLabel(text: string) {
        let label = getLabel(text);
        this.addChild(label);
        this.assignedLabels.push(label);
        return label;
    }

    releaseLabels() {
        _.forEach(this.assignedLabels, (label) => releaseLabel(label));
        this.assignedLabels.length = 0;
    }

    destroy() {
        this.releaseLabels();
        super.destroy();
    }
}

function emptyArgumentGraphicsGenerator(block: BlockGenerator) {
    return function *() {
        for (let _argumentName of block.definition.argumentNames) {
            yield null;
        }
    };
}

export class BlockGenerator extends LabelManager {
    graphics: PIXI.Graphics = new PIXI.Graphics();

    readonly definition: BlockDefinition;

    constructor(public readonly blockClass: BlockClass) {
        super();

        this.definition = blockClass.definition;

        this.addChild(this.graphics);
        this.interactive = true;
        this.buttonMode = true;

        blockClass.definition.nodeDrawer.drawNode(this, emptyArgumentGraphicsGenerator(this));

        this.on('mousedown', () => {
            let block = new blockClass();
            Komodi.fixed.addChild(block.graphic);

            let globalPosition = this.getGlobalPosition();
            block.graphic.x = globalPosition.x;
            block.graphic.y = globalPosition.y;
            Komodi.attacher.setDragging(block, true);
        });
    }
}

export class BlockGraphic extends LabelManager {
    readonly graphics: PIXI.Graphics = new PIXI.Graphics();

    constructor(private logic: Block, private nodeDrawer: NodeDrawer, private scopeDrawer: ScopeDrawer) {
        super();

        this.addChild(this.graphics);
        this.interactive = true;

        this.on('mousedown', (e: PIXI.interaction.InteractionEvent) => {
            if (e.target == this) {
                let position = this.getGlobalPosition();
                if (this.logic.attachInfo != null) {
                    this.logic.attachInfo.target.detachBlock(this.logic);
                }
                Komodi.stage.addChild(this);
                this.position = Komodi.stage.toLocal(position);
                Komodi.attacher.setDragging(this.logic);
            }
        });
    }

    update(getArgumentGraphics: () => IterableIterator<BlockGraphic | null>, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>) {
        this.graphics.clear();

        this.scopeDrawer.drawScope(this.logic, getScopeGraphics);
        this.nodeDrawer.drawNode(this.logic, getArgumentGraphics);
    }
}

export abstract class NodeDrawer {
    abstract drawNode(block: Block | BlockGenerator, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>): void;
}

export abstract class ScopeDrawer {
    abstract drawScope(block: Block, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>): void;
}

export class PlaceholderToken {
    kind: "placeholder" = "placeholder";
    constructor(readonly text: string) {
    }
}

export class UserInputToken {
    kind: "user_input" = "user_input";
    constructor(readonly identifier: string, readonly type: KomodiType) {
    }
}

export class ExpressionToken {
    kind: "expression" = "expression";
    constructor(readonly identifier: string, readonly type: KomodiType) {
    }
}

export type Token = PlaceholderToken | UserInputToken | ExpressionToken;
