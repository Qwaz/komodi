import * as _ from "lodash";
import {Shape} from "../shape/shape";
import {Parser} from "../parser/Parser";
import {Control} from "../controls/Control";
import {ParameterFactory} from "../factories/ParameterFactory";
import {IconButton, Icons} from "./IconButton";
import {enableHighlight, makeTargetInteractive, stagePositionOf} from "../utils";
import {Global} from "../entry";
import {GeneratorEventType} from "./customEvents";

const ICON_Y = 18;

// TODO: update any type
declare let dat: any;

export class ParameterGenerator<F extends Control, P extends Parser, S extends Shape> extends PIXI.Container {
    private shape: S;

    constructor(private target: ParameterFactory<F, P, S>) {
        super();

        let icon: IconButton = new IconButton(Icons.WRENCH, {
            radius: 12,
            fontSize: 14,
            fontColor: 0x000000,
            color: 0xEEEEEE,
        });
        this.addChild(icon);
        icon.y = ICON_Y;

        icon.on("click", () => {
            let gui = new dat.GUI({
                autoPlace: false
            });
            for (let info of target.controlParameterInfo) {
                let argumentArr = [target.data, info.name];
                if (info.options !== undefined) {
                    argumentArr = _.concat(argumentArr, info.options);
                }
                let controller = gui.add.apply(gui, argumentArr);
                controller.onFinishChange(() => {
                    this.target.update();
                    this.updateShape();
                });
            }

            Global.showModal(gui);
        });

        this.updateShape();
    }

    private updateShape() {
        if (this.shape) {
            this.removeChild(this.shape);
        }
        this.shape = this.target.shape.clone();
        this.addChild(this.shape);

        makeTargetInteractive(this.shape);
        enableHighlight(this.shape);

        this.shape.on('mousedown', () => {
            let stagePosition = stagePositionOf(this);

            let flowItem = this.target.createControl();
            Global.stage.addChild(flowItem);
            Global.setDragging(flowItem, stagePosition.x, stagePosition.y);
        });

        this.emit(GeneratorEventType.UPDATE_SHAPE, this);
    }
}