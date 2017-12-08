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

export function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
