import * as PIXI from "pixi.js";
import {Komodi} from "../global";

export function centerChild(target: PIXI.DisplayObject, x: number, y: number) {
    let localBounds = target.getLocalBounds();
    target.x = x - localBounds.width*.5;
    target.y = y - localBounds.height*.5;
}

export function getMousePoint() {
    return Komodi.renderer.plugins.interaction.mouse.global.clone();
}
