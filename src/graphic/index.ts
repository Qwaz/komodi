import * as _ from "lodash";
import {KomodiType} from "../type";
import {BlockDefinition} from "../program/definition_parser";

let labelPool: PIXI.Text[] = [];

export function getLabel(text: string): PIXI.Text {
    if (labelPool.length == 0) {
        return new PIXI.Text(text, {
            fontSize: 14, align : 'center'
        });
    }
    let label = labelPool.pop()!;
    label.text = text;
    return label;
}

export function releaseLabel(label: PIXI.Text) {
    labelPool.push(label);
}

export class BlockGraphic extends PIXI.Container {
    readonly graphics: PIXI.Graphics = new PIXI.Graphics();

    assignedLabels: PIXI.Text[] = [];

    constructor(private nodeDrawer: NodeDrawer, private scopeDrawer: ScopeDrawer) {
        super();

        this.addChild(this.graphics);
    }

    update(definition: BlockDefinition, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>) {
        this.graphics.clear();

        this.scopeDrawer.drawScope(definition, this, getScopeGraphics);
        this.nodeDrawer.drawNode(definition, this, getArgumentGraphics);
    }

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

export abstract class NodeDrawer {
    abstract drawNode(definition: BlockDefinition, target: BlockGraphic, getArgumentGraphics: () => IterableIterator<BlockGraphic | null>): void;
}

export abstract class ScopeDrawer {
    abstract drawScope(definition: BlockDefinition, target: BlockGraphic, getScopeGraphics: () => IterableIterator<IterableIterator<BlockGraphic>>): void;
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
