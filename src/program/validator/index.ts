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
    result: ValidationResult;

    constructor(initialize: boolean = true) {
        if (initialize) {
            this.scopeTree = [];
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


    validate(program: SerializedProgram): string {
        this.context.module.clear();
        this.context.serializer.deserializeProgram(program);

        let validationResult = '';

        let modules = this.context.module.getModuleList();
        for (let moduleName of modules.userModule) {
            validationResult += `<heading>Module "${moduleName}"\n</heading>`;
            let cnt = 0;
            for (let block of this.context.module.blockListOf(moduleName).values()) {
                if (block.attachInfo == null) {
                    cnt++;
                    validationResult += `FreeBlock #${cnt}: `;
                    let result = this.validateFreeBlock(block);
                    if (result.info.length > 0 || result.warning.length > 0 || result.error.length > 0) {
                        validationResult += '\n';
                        for (let infoString of result.info) {
                            validationResult += `[INFO] ${infoString}\n`;
                        }
                        for (let warningString of result.warning) {
                            validationResult += `<warning>[WARNING] ${warningString}\n</warning>`;
                        }
                        for (let errorString of result.error) {
                            validationResult += `<error>[ERROR] ${errorString}\n</error>`;
                        }
                    } else {
                        validationResult += 'OK!\n';
                    }
                }
            }
            if (this.context.module.blockListOf(moduleName).size == 0) {
                validationResult += "Nothing to validate.\n";
            }
            validationResult += "\n";
        }

        return validationResult;
    }
}
