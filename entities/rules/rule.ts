import { ZapError, ZapContext } from "../core";

export abstract class Rule {
    protected error: ZapError;
    protected errorMessage: string;
    abstract validate(context: ZapContext): boolean;

    override(errorMessage?: string) : Rule{
        this.errorMessage = errorMessage;
        return this;
    }
    
    raiseError(): void {
        throw new ZapError(this.errorMessage);
    }
}