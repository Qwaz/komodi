import * as _ from "lodash";
import {KomodiContext} from "../../context";
import {SerializedProgram} from "../serializer";
import {Block} from "../index";
import {Module} from "../module";
import {validatorIntoAll, validatorPreAll} from "./validating_functions";

export interface ValidationResult {
    info: string[],
    warning: string[],
    error: string[]
}

export class ValidationContext {
    scopeTree: Block[];
    loopDepth: number;
    result: ValidationResult;

    constructor(initialize: boolean = true) {
        if (initialize) {
            this.scopeTree = [];
            this.loopDepth = 0;
            this.result = {
                info: [],
                warning: [],
                error: []
            };
        }
    }

    clone(): ValidationContext {
        let newContext = new ValidationContext(false);
        newContext.scopeTree = _.clone(this.scopeTree);
        newContext.loopDepth = this.loopDepth;
        newContext.result = this.result;

        return newContext;
    }
}

export type ValidationFunction = (block: Block, module: Module, context: ValidationContext) => void;

export class Validator {
    readonly context: KomodiContext = new KomodiContext();

    private validateBlock(block: Block, context: ValidationContext): ValidationContext {
        for (let argumentName of block.definition.argumentNames) {
            let argumentBlock = block.getArgument(argumentName);
            if (argumentBlock) {
                this.validateBlock(argumentBlock, context);
            }
        }

        for (let validationFunction of validatorPreAll) {
            validationFunction(block, this.context.module, context);
        }
        for (let validationFunction of block.definition.validatorPre) {
            validationFunction(block, this.context.module, context);
        }

        let intoContext = context.clone();
        for (let validationFunction of validatorIntoAll) {
            validationFunction(block, this.context.module, intoContext);
        }
        for (let validationFunction of block.definition.validatorInto) {
            validationFunction(block, this.context.module, intoContext);
        }

        for (let scopeName of block.definition.scopeNames) {
            let scopeContext = intoContext.clone();
            for (let scopeBlock of block.getScope(scopeName)) {
                scopeContext = this.validateBlock(scopeBlock, scopeContext);
            }
        }
        return context;
    }

    private validateFreeBlock(block: Block): ValidationResult {
        let context = new ValidationContext();
        this.validateBlock(block, context);
        return context.result;
    }

    validate(program: SerializedProgram): Map<String, ValidationResult[]> {
        this.context.module.clear();
        this.context.serializer.deserializeProgram(program);

        let validationResultMap = new Map();

        let modules = this.context.module.getModuleList();
        for (let moduleName of modules.userModule) {
            let arr = [];
            for (let block of this.context.module.blockListOf(moduleName).values()) {
                if (block.attachInfo == null) {
                    arr.push(this.validateFreeBlock(block));
                }
            }
            validationResultMap.set(moduleName, arr);
        }

        return validationResultMap;
    }
}

export function validationResultMapToString(map: Map<String, ValidationResult[]>) {
    let str = '';
    for (let [moduleName, arr] of map.entries()) {
        str += `<heading>Module "${moduleName}"\n</heading>`;

        let cnt = 0;
        for (let result of arr) {
            cnt++;
            str += `FreeBlock #${cnt}: `;
            if (result.info.length > 0 || result.warning.length > 0 || result.error.length > 0) {
                str += '\n';
                for (let infoString of result.info) {
                    str += `[INFO] ${infoString}\n`;
                }
                for (let warningString of result.warning) {
                    str += `<warning>[WARNING] ${warningString}\n</warning>`;
                }
                for (let errorString of result.error) {
                    str += `<error>[ERROR] ${errorString}\n</error>`;
                }
            } else {
                str += 'OK!\n';
            }
        }
        if (arr.length == 0) {
            str += "Nothing to validate.\n";
        }
        str += "\n";
    }
    return str;
}
