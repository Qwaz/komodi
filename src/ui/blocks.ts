import {Block, FlowItemFactory, Signal} from "./flow";
import {UnaryBlockShape} from "../shape/UnaryBlockShape";
import {BinaryBlockShape} from "../shape/BinaryBlockShape";
import {SmallBlockShape} from "../shape/SmallBlockShape";
import {SignalShape} from "../shape/SignalShape";
import {noStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";

class SimpleBlock extends Block {
    constructor(shape: BlockShape) {
        super(shape, [], noStrategy);
    }
}

export let startSignalFactory = new FlowItemFactory(Signal, new SignalShape());

export let smallBlockFactory = new FlowItemFactory(SimpleBlock, new SmallBlockShape(0xBDBDBD));
export let purpleBlockFactory = new FlowItemFactory(SimpleBlock, new UnaryBlockShape(0xCE93D8));
export let orangeBlockFactory = new FlowItemFactory(SimpleBlock, new UnaryBlockShape(0xFFC107));
export let binaryBlockFactory = new FlowItemFactory(SimpleBlock, new BinaryBlockShape(0x81C784));
