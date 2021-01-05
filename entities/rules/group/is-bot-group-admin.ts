import { Rule } from "..";
import { ZapContext } from "../../core";

export class BotAdminRule extends Rule {

    errorMessage = 'O bot não é administrador do grupo.';

    validate(context: ZapContext): boolean{
        let botNumber = context.botNumber;
        let valid = context.groupAdmins.includes(botNumber);
        return valid;
    }
}