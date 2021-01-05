import { Rule } from "..";
import { ZapContext } from "../../core";

export class GroupOnlyRule extends Rule {

    getErrorMessage() {
        return 'Essa mensagem não chegou de um grupo.';
    }

    validate(context: ZapContext): boolean{
        return context.isGroupMsg;
    }
}