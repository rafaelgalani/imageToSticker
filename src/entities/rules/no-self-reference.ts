import { ContactId } from "@open-wa/wa-automate";
import { Rule } from "..";
import { ZapContext } from "src/entities/core";

export class SelfReferenceRule extends Rule {
    
    target: ContactId;
    errorMessage = "Não é permitido se referir à si mesmo com esse comando.";

    constructor(target?: ContactId){
        super();
        this.target = target;
    }

    validate(context: ZapContext): boolean{
        let target = this.target;

        return !target || (context.sender.id !== target)
    }
}