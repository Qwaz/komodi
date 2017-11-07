import {Expression} from "../index";

export class ExpConstantString extends Expression {
    constructor () {
        super({
            id: ExpConstantString.name, definition: "{str: string}: string"
        });
        this.initFinished();
    }
}

export class ExpConcatString extends Expression {
    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super({
            id: ExpConcatString.name, definition: "concat [str1: string] + [str2: string]: string"
        });
        this.initFinished();
    }
}

export class ExpCompareString extends Expression {
    str1: Expression | null = null;
    str2: Expression | null = null;

    constructor () {
        super({
            id: ExpCompareString.name, definition: "is same [str1: string], [str2: string]: bool"
        });
        this.initFinished();
    }
}
