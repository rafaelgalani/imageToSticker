import { Rule } from "..";
import { ZapContext } from "../../core";

export class MustHaveArgumentsRule extends Rule {

    minArgsCount: number;

    constructor(minArgsCount: number = 1) {
        super();
        this.minArgsCount = minArgsCount;
        this.errorMessage = `${this.toLabel('Deve', 'm')} ser ${this.toLabel('informado')} pelo menos ${this.minArgsCount} ${this.toLabel('argumento')}.`;
    }

    private toLabel(label: string, pluralModifier: string = 's'){
        return label + (this.minArgsCount > 1? pluralModifier : '');
    }

    validate(context: ZapContext): boolean{
        return context.args.length >= this.minArgsCount;
    }
}