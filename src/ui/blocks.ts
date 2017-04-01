import {Block, FlowItemFactory} from "./flow";
import BubbleShape from "../shape/BubbleShape";
import Shape from "../shape/Shape";

class UnitaryBlock extends Block {
    constructor(shape: Shape) {
        super(shape);
    }

    calculateElementSize(): void {
    }

    drawBranch(): void {
    }

    editingPoints(): void {
    }
}

export let purpleBlockFactory = new FlowItemFactory(UnitaryBlock, new BubbleShape(0x9b59b6));
export let orangeBlockFactory = new FlowItemFactory(UnitaryBlock, new BubbleShape(0xf1c40f));