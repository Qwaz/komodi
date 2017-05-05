import {Block, FlowControl} from "../ui/flow";

export class Logic {
    constructor(readonly pattern: string) {}

    parseLogic(control: FlowControl): string {
        let ret = '';

        let now: FlowControl | null = control;
        while (now) {
            let pat = now.logic.pattern;
            if (now instanceof Block) {
                for (let i = now.numLogic-1; i >= 0; i--) {
                    let child = now.logicChildren[i];
                    pat = pat.replace(`@${i+1}`,
                        child ? child.logic.parseLogic(child) : "");
                }
            }
            for (let i = now.numFlow; i >= 1; i--) {
                let child = now.flowChildren[i];
                pat = pat.replace(`$${i}`,
                    child ? child.logic.parseLogic(child) : "");
            }
            if (ret != '') {
                ret += ';';
            }
            ret += pat;
            now = now.flowNext;
        }
        return ret;
    }
}