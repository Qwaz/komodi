import {Command, Expression} from "../index";

export class ExpReadLine extends Expression {
    constructor () {
        super({
            id: ExpReadLine.name, definition: "read line: string"
        });
        this.initFinished();
    }
}

export class CmdPrintLine extends Command {
    str: Expression | null = null;

    constructor() {
        super({
            id: CmdPrintLine.name, definition: "print line [str: string]", scopeNames: []
        });
        this.initFinished();
    }
}
