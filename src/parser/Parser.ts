import {Block, Control} from "../controls";

export class Parser {
    constructor(readonly pattern: string) {}

    parse(control: Control): string {
        let ret = '';

        let now: Control | null = control;
        while (now) {
            let pat = now.parser.pattern;
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
}