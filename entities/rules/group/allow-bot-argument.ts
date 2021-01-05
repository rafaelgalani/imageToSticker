import { Rule } from "..";
import { ZapContext } from "../../core";

export class AllowBotArgumentRule extends Rule {

    shouldAllow: boolean;

    constructor(shouldAllow: boolean) {
        super();
        this.shouldAllow = shouldAllow;
        this.errorMessage = `O bot ${this.shouldAllow? 'deve' : 'não deve'} ser usado como argumento desse comando.`
    }

    validate(context: ZapContext): boolean{
        let { botNumber } = context;
        return !!context.args.find(a => this.shouldAllow? a === botNumber : a !== botNumber);
    }
}