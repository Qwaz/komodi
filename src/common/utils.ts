import * as PIXI from "pixi.js";
import {KomodiClass} from "../komodi";
import {KomodiContext} from "../context";

export function centerChild(target: PIXI.DisplayObject, x: number, y: number) {
    let localBounds = target.getLocalBounds();
    target.x = x - localBounds.width*.5;
    target.y = y - localBounds.height*.5;
}

export function getMousePoint(komodi: KomodiContext): PIXI.Point {
    if (komodi instanceof KomodiClass) {
        return komodi.renderer.plugins.interaction.mouse.global.clone();
    }
    return new PIXI.Point(0, 0);
}

export function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function uuidToJsIdentifier(str: string): string {
    return 'f'+str.replace(/-/g, '_');
}
