import { ContactId } from "@open-wa/wa-automate";
import { Rule } from "..";
import { ZapContext } from "src/entities/core";
import { isMention, toContactId, toMention } from "src/utils";
import { Mention } from "src/types";

export class SelfReferenceRule extends Rule {
    
    target: ContactId;
    errorMessage = "Não é permitido se referir à si mesmo com esse comando.";

    constructor(target?: ContactId){
        super();
        this.target = target;
    }

    validate(context: ZapContext): boolean{
        const [ who ] = context.args;

        // Can't self reference.
        if ( toContactId( who as Mention ) === context.sender.id ) return false; 

        return true;
    }
}