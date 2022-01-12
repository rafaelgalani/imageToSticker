import { Rule } from "..";
import { ZapContext } from "../../core";

export class IsFromBotRule extends Rule {

    errorMessage = 'A mensagem não veio do bot.';

    validate(context: ZapContext): boolean{
        return context.sender.id === context.botNumber;
    }
}