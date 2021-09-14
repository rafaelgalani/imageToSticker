import { Rule } from "..";
import { ZapContext } from "../../core";

export class GroupOnlyRule extends Rule {

    errorMessage = 'Esse comando só funciona em grupos.';

    validate(context: ZapContext): boolean{
        return context.isGroupMsg;
    }
}