import { ContactId } from "@open-wa/wa-automate";
import { Rule } from "..";
import { ZapContext } from "../../core";

export class AdminRule extends Rule {
    
    target: ContactId;
    errorMessage = "O membro que usou o comando não é um administrador do grupo.";

    constructor(target?: ContactId){
        super();
        this.target = target;
    }

    validate(context: ZapContext): boolean{
        let target = this.target || context.sender.id,
            valid = context.groupAdmins.includes(target);
            
        return valid;
    }
}