import { ZapError } from "../../core/error";

export class ArgumentFormat {

    predicate: (targetArgument: string) => boolean;
    position?: number;
    protected errorMessage: string;

    override(errorMessage?: string) : ArgumentFormat{
        this.errorMessage = errorMessage;
        return this;
    }
    
    raiseError(): void {
        throw new ZapError(this.errorMessage);
    }

    constructor(predicate: (arg: string) => boolean, position?: number) {
        this.position = position;
        this.predicate = predicate;
    }

    validate(argument: string): boolean{
        return this.predicate(argument);
    }
}