import { Rule } from "..";
import { ZapContext } from "../../core";

export class AdminRule extends Rule {
    errorMessage = "O membro não é um administrador do grupo.";

    validate(context: ZapContext): boolean{
        let valid = context.groupAdmins.includes(context.sender.id);
        return valid;
    }
}