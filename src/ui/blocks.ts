import {Block, Declaration, FlowItemFactory, Signal} from "./flow";
import {UnaryBlockShape} from "../shape/UnaryBlockShape";
import {BinaryBlockShape} from "../shape/BinaryBlockShape";
import {SmallBlockShape} from "../shape/SmallBlockShape";
import {SignalShape} from "../shape/SignalShape";
import {noStrategy, splitJoinStrategy} from "../controllers/flowStrategies";
import {BlockShape} from "../shape/shape";
import {IfBlockShape} from "../shape/IfBlockShape";
import {DeclarationShape} from "../shape/DeclarationShape";

class SimpleBlock extends Block {
    constructor(shape: BlockShape) {
        super(shape, 0, noStrategy);
    }
}

class BranchBlock extends Block {
    constructor(shape: BlockShape) {
        super(shape, 2, splitJoinStrategy);
    }
}

export let startSignalFactory = new FlowItemFactory(Signal, new SignalShape());

export let ifBlockFactory = new FlowItemFactory(BranchBlock, new IfBlockShape(0xB2EBF2));

export let declarationFactory = new FlowItemFactory(Declaration, new DeclarationShape(0xC8E6C9));

export let smallBlockFactory = new FlowItemFactory(SimpleBlock, new SmallBlockShape(0xBDBDBD));
export let brownBlockFactory = new FlowItemFactory(SimpleBlock, new UnaryBlockShape(0xD7CCC8));
export let orangeBlockFactory = new FlowItemFactory(SimpleBlock, new UnaryBlockShape(0xFFECB3));
export let binaryBlockFactory = new FlowItemFactory(SimpleBlock, new BinaryBlockShape(0xB0BEC5));
