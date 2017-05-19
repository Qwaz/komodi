import {Control, Signal} from "../ui/controls";

export class GlobalManager {
    private globals: Set <Control> = new Set<Signal>();

    registerGlobal(signal: Control) {
        this.globals.add(signal);
    }

    deleteGlobal(signal: Control) {
        this.globals.delete(signal);
    }

    generateCode(): string {
        let result = '';
        for (let control of this.globals) {
            result += control.parser.parse(control) + ';';
        }
        return result;
    }
}