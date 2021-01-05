import { Rule } from "..";
import { ZapContext, ZapError } from "../../core";

export default class AdminRule extends Rule {
    constructor(){
        super();
        this.error = new ZapError('O membro não é administrador.');
    }

    validate(context: ZapContext): boolean{
        let valid = context.groupAdmins.includes(context.sender.id);
        return valid;
    }
}