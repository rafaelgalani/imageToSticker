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

interface ArgExpression {
    target: number;
    operation: ArgsOperator;
}

export class NArgumentsRule extends Rule {    
    expression: ArgExpression;
    optionalExpression: ArgExpression;

    constructor(expression : ArgExpression, optionalExpression? : ArgExpression) {
        super();
        expression.target = expression.target ?? 1;
        if (!expression.operation){
            throw new Error('Expression operation cannot be null.');
        }
        this.expression = expression;
        
        if (optionalExpression){
            optionalExpression.target = optionalExpression.target ?? 1;
            if (!optionalExpression.operation){
                throw new Error('Optional expression operation cannot be null.');
            }
        }
        this.optionalExpression = optionalExpression;

        if (!this.optionalExpression){
            this.errorMessage = `O número de argumentos deve ser ${argsLabelMap.get(this.expression.operation)} ${this.expression.target}.`;
        } else {
            this.errorMessage = `
            O número de argumentos deve ser ${argsLabelMap.get(this.expression.operation)} ${this.expression.target} e ${argsLabelMap.get(this.optionalExpression.operation)} ${this.optionalExpression.target}
            `;
        }
    }

    validate(context: ZapContext): boolean{
        // High IQ. Don't even try it.
        let optionalStatement = (
            this.optionalExpression?
            `&& context.args.length ${this.optionalExpression.operation} ${this.optionalExpression.target}` : 
            ''
        );

        return eval(`
            context.args.length ${this.expression.operation} ${this.expression.target} ${optionalStatement}
        `);
    }
}