import {Block, FlowItemFactory, Signal} from "./flow";
import {UnaryBlockShape} from "../shape/UnaryBlockShape";
import {BinaryBlockShape} from "../shape/BinaryBlockShape";
import {SmallBlockShape} from "../shape/SmallBlockShape";
import {SignalShape} from "../shape/SignalShape";

export let startSignalFactory = new FlowItemFactory(Signal, new SignalShape());

export let smallBlockFactory = new FlowItemFactory(Block, new SmallBlockShape(0x95a5a6));
export let purpleBlockFactory = new FlowItemFactory(Block, new UnaryBlockShape(0x9b59b6));
export let orangeBlockFactory = new FlowItemFactory(Block, new UnaryBlockShape(0xf1c40f));
export let binaryBlockFactory = new FlowItemFactory(Block, new BinaryBlockShape(0x2ecc71));
