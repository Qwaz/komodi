import {Signal} from "../ui/flow";

export class LogicController {
    private signals: Set <Signal> = new Set<Signal>();

    registerSignal(signal: Signal) {
        this.signals.add(signal);
    }

    deleteSignal(signal: Signal) {
        this.signals.delete(signal);
    }

    generateCode(): string {
        let result = '';
        for (let signal of this.signals) {
            result += signal.logic.parseLogic(signal) + ';';
        }
        return result;
    }
}