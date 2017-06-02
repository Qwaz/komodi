import {Control} from "../controls/Control";
import {Block} from "../controls/Block";

export abstract class Parser {
    abstract parse(control: Control): string;
}

function parsePattern(control: Control, pattern: string) {
    let now: Control | null = control;

    let pat = pattern;
    if (now instanceof Block) {
        for (let i = now.numLogic-1; i >= 0; i--) {
            let child = now.logicChildren[i];
            pat = pat.replace(new RegExp(`@${i+1}`, 'g'),
                child ? child.parser.parse(child) : "");
        }
    }
    if (now.scope) {
        for (let i = now.scope.numScope; i >= 1; i--) {
            let child = now.scope.scopeChildren[i-1];
            pat = pat.replace(new RegExp(`\\$${i}`, 'g'),
                child ? child.parser.parse(child) : "");
        }
    }

    if (now.flow) {
        let next = now.flow;
        pat += ';' + next.parser.parse(next);
    }

    return pat;
}

export class PatternParser extends Parser {
    constructor(readonly pattern: string) {
        super();
    }

    parse(control: Control): string {
        return parsePattern(control, this.pattern);
    }
}

export class ParameterParser extends PatternParser {
    constructor(pattern: string, readonly id: string) {
        super(pattern);
    }
}