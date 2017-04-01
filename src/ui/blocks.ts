import {Block, FlowItemFactory} from "./flow";
import {UnitaryBlockShape} from "../shape/UnitaryBlockShape";
import {BinaryBlockShape} from "../shape/BinaryBlockShape";
import {SmallBlockShape} from "../shape/SmallBlockShape";

export let purpleBlockFactory = new FlowItemFactory(Block, new UnitaryBlockShape(0x9b59b6));
export let orangeBlockFactory = new FlowItemFactory(Block, new UnitaryBlockShape(0xf1c40f));

export let binaryBlockFactory = new FlowItemFactory(Block, new BinaryBlockShape(0x2ecc71));

export let smallBlockFactory = new FlowItemFactory(Block, new SmallBlockShape(0x95a5a6));