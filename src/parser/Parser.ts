import {Control} from "../controls/Control";
import {Block} from "../controls/Block";
import {Declaration} from "../controls/Declaration";

export abstract class Parser {
    abstract parse(control: Control): string;
}

function parsePattern(control: Control, pattern: string) {
    let ret = '';

    let now: Control | null = control;
    while (now) {
        let pat = pattern;
        if (now instanceof Block) {
            for (let i = now.numLogic-1; i >= 0; i--) {
                let child = now.logicChildren[i];
                pat = pat.replace(`@${i+1}`,
                    child ? child.parser.parse(child) : "");
            }
        }
        if (now.scope) {
            for (let i = now.scope.numScope; i >= 1; i--) {
                let child = now.scope.scopeChildren[i-1];
                pat = pat.replace(`$${i}`,
                    child ? child.parser.parse(child) : "");
            }
        }
        if (ret != '') {
            ret += ';';
        }
        ret += pat;
        now = now.flow;
    }
    return ret;
}

export class PatternParser extends Parser {
    constructor(readonly pattern: string) {
        super();
    }

    parse(control: Control): string {
        return parsePattern(control, this.pattern);
    }
}

export class DeclarationParser extends Parser {
    parse(declaration: Declaration): string {
        return parsePattern(declaration, `{let ${declaration.id} = (@1); $1}`);
    }
}