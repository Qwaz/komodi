import BubbleShape from "../shape/BubbleShape";
import {State} from "../entry";
import {hitTestRectangle} from "../utils";

export class Block extends PIXI.Container {
    private _color: number;
    private _highlight: boolean = false;

    private _prevBlock: Block | null = null;
    private _nextBlock: Block | null = null;

    private _normalShape: BubbleShape;
    private _highlightShape: BubbleShape;
    private _currentShape: BubbleShape;

    constructor(color: number) {
        super();
        State.dragging = this;
        State.freeBlocks.add(this);

        this._color = color;

        this._normalShape = new BubbleShape(color, false);
        this._highlightShape = new BubbleShape(color, true);

        this._currentShape = this._normalShape;
        this.addChild(this._currentShape);

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = BubbleShape.hitArea;

        this.on('mouseover', () => this.alpha = 0.7);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            State.dragging = this;

            if (this._prevBlock) {
                State.freeBlocks.add(this._prevBlock);
                this._prevBlock._nextBlock = null;
                this._prevBlock = null;
            }
        });

        this.on('mouseup', () => {
            if (hitTestRectangle(this, State.menu)) {
                this.deleteTree();
            } else {
                State.freeBlocks.forEach((block) => {
                    if (!this._prevBlock && block.possibleNextBlock(this)) {
                        this._prevBlock = block;
                        block._nextBlock = this;
                        block.highlight = false;
                        State.freeBlocks.delete(block);

                        block.adjustChildrenPosition();
                    }
                });
            }
            State.dragging = null;
        });
    }

    get highlight() {
        return this._highlight;
    }

    set highlight(highlighted) {
        this._highlight = highlighted;

        this.removeChild(this._currentShape);
        this._currentShape = highlighted ? this._highlightShape : this._normalShape;
        this.addChild(this._currentShape);
    }

    possibleNextBlock(block: Block | null) {
        if (block) {
            let NEAR = 40;

            return Math.abs(block.x - this.x) <= NEAR
                && Math.abs(block.y - (this.y - BubbleShape.BUBBLE_HEIGHT)) <= NEAR;
        }
        return false;
    }

    deleteTree() {
        if (State.freeBlocks.has(this)) {
            State.freeBlocks.delete(this);
        }
        this.parent.removeChild(this);
        if (this._nextBlock) {
            this._nextBlock.deleteTree();
        }
    }

    adjustChildrenPosition() {
        if (this._nextBlock) {
            this._nextBlock.x = this.x;
            this._nextBlock.y = this.y - BubbleShape.BUBBLE_HEIGHT;
            this._nextBlock.adjustChildrenPosition();
        }
    }
}

export class BlockGenerator extends PIXI.Container {
    private _color: number;

    constructor(color: number) {
        super();

        this._color = color;
        this.addChild(new BubbleShape(color, false));

        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = BubbleShape.hitArea;

        this.on('mouseover', () => this.alpha = 0.7);
        this.on('mouseout', () => this.alpha = 1);

        this.on('mousedown', () => {
            let block = new Block(this._color);
            State.stage.addChild(block);
        });
    }
}