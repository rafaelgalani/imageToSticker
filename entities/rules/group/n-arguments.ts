import { Rule } from "..";
import { ZapContext } from "../../core";

export enum ArgsOperator {
    EQ  = '===',
    GT  = '>',
    LT  = '<',
    GTE = '>=',
    LTE = '<='
};

const argsLabelMap = new Map<ArgsOperator, string>([
    [ArgsOperator.EQ,  'igual a'],
    [ArgsOperator.GT,  'maior que'],
    [ArgsOperator.LT,  'menor que'],
    [ArgsOperator.GTE, 'maior ou igual a'],
    [ArgsOperator.LTE, 'menor ou igual a'],
]);

export class NArgumentsRule extends Rule {

    target: number;
    operation: ArgsOperator;

    constructor(minArgsCount: number = 1, operation: ArgsOperator) {
        super();
        if (!operation){
            throw new Error('Operation cannot be null.');
        }
        this.operation = operation;
        this.target = minArgsCount;
        this.errorMessage = `O número de argumentos deve ser ${argsLabelMap.get(operation)} ${this.target}.`;
    }

    validate(context: ZapContext): boolean{
        // High IQ. Don't even try it.
        return eval(`
            context.args.length ${this.operation} this.target
        `);
    }
}