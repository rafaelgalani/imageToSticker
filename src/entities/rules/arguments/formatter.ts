import { ZapContext } from "../../core/context";
import { Rule } from "../rule";
import { ArgumentFormat } from "./format";

export class ArgumentFormatterRule extends Rule {

    formats: ArgumentFormat[];

    constructor(formats: Array<ArgumentFormat>){
        super();
        this.formats = formats;
    }

    validate(context: ZapContext): boolean{
        let genericFormats = this.formats.filter(format => format.position == null),
            specificFormats = this.formats.filter(format => format.position != null)

        for(let format of genericFormats){
            for(let argument of context.args){
                if (!format.validate(argument)) format.raiseError();
            }
        }   

        for (let format of specificFormats){
            let targetArgument = context.args[format.position];
            if (!format.validate(targetArgument)) format.raiseError();
        }

        return true;
    }
}