import {Command, Expression, Scope, Signal} from "../index";

export class CmdIfElse extends Command {
    condition: Expression | null = null;
    ifBranch: Scope = [];
    elseBranch: Scope = [];

    constructor() {
        super({
            id: CmdIfElse.name, definition: "if [condition: bool]", scopeNames: ["ifBranch", "elseBranch"]
        });
    }
}

export class SignalStart extends Signal {
    body: Scope = [];

    constructor() {
        super({
            id: SignalStart.name, definition: "start", scopeNames: ["body"]
        });
    }
}
