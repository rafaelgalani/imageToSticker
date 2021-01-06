import { Rule } from "..";
import { ZapContext } from "../../core";

export class AdminRule extends Rule {
    
    target: string;
    errorMessage = "O membro não é um administrador do grupo.";

    constructor(target?: string){
        super();
        this.target = target;
    }

    validate(context: ZapContext): boolean{
        let target = this.target || context.sender.id,
            valid = context.groupAdmins.includes(target);
            
        return valid;
    }
}