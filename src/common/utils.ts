import * as PIXI from "pixi.js";
import {Komodi} from "../global";

export function hitTestRectangle(obj1: PIXI.DisplayObject, obj2: PIXI.DisplayObject) {
    let bound1 = obj1.getBounds();
    let bound2 = obj2.getBounds();

    let center1 = {
        x: (bound1.left + bound1.right) * .5,
        y: (bound1.top + bound1.bottom) * .5,
    };

    let center2 = {
        x: (bound2.left + bound2.right) * .5,
        y: (bound2.top + bound2.bottom) * .5,
    };

    let vx = center2.x - center1.x;
    let vy = center2.y - center1.y;

    return Math.abs(vx) < (bound1.width+bound2.width)*.5
        && Math.abs(vy) < (bound1.height+bound2.height)*.5;
}

export function moveToTop(target: PIXI.DisplayObject) {
    target.parent.setChildIndex(target, target.parent.children.length-1);
}

export function centerChild(target: PIXI.DisplayObject, x: number, y: number) {
    let localBounds = target.getLocalBounds();
    target.x = x - localBounds.width*.5;
    target.y = y - localBounds.height*.5;
}

export function stagePositionOf(target: PIXI.DisplayObject): PIXI.Point {
    return Komodi.stage.toLocal(target.position, target.parent);
}

export function makeTargetInteractive(target: PIXI.DisplayObject) {
    target.interactive = true;
    target.buttonMode = true;
}

export function getMousePoint() {
    return Komodi.renderer.plugins.interaction.mouse.global.clone();
}

let tokenCount = 0;
export function generateToken() {
    tokenCount++;
    return `var${tokenCount}`;
}
