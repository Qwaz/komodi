import {Control, Signal} from "../controls";

export class GlobalManager {
    private globals: Set <Control> = new Set<Signal>();

    registerGlobal(signal: Control) {
        this.globals.add(signal);
    }

    deleteGlobal(signal: Control) {
        this.globals.delete(signal);
    }

    generateCode(): string {
        // TODO: Code generation should not depend on global Komodi object
        let result = 'Komodi.hook.startHook && Komodi.hook.startHook();';
        for (let control of this.globals) {
            result += control.parser.parse(control) + ';';
        }
        result += "Komodi.hook.initHook && Komodi.hook.initHook();";
        return result;
    }
}