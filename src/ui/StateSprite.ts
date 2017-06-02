import * as PIXI from "pixi.js";

export class StateSprite extends PIXI.Container {
    private stateMap: Map<string, PIXI.DisplayObject> = new Map();

    private _currentState: string;

    constructor() {
        super();
    }

    addState(stateName: string, obj: PIXI.DisplayObject) {
        if (this.stateMap.has(stateName)) {
            throw new Error("Duplicate state name");
        }
        this.stateMap.set(stateName, obj);
        obj.visible = false;
        this.addChild(obj);
    }

    setState(stateName: string) {
        if (stateName == this._currentState) {
            return true;
        }

        let newObj = this.stateMap.get(stateName);
        if (newObj !== undefined) {
            newObj.visible = true;

            let prevObj = this.stateMap.get(this._currentState);
            if (prevObj !== undefined) {
                prevObj.visible = false;
            }

            this._currentState = stateName;
            return true;
        }
        return false;
    }

    get currentState() {
        return this._currentState;
    }
}