import { ZapError, ZapContext } from "../core";

export abstract class Rule {
    protected error: ZapError;
    public reversed: boolean = false;
    protected errorMessage: string;
    abstract validate(context: ZapContext): boolean;

    reverse(shouldReverse: boolean) : Rule{
        this.reversed = shouldReverse;
        return this;
    }

    override(errorMessage?: string) : Rule{
        this.errorMessage = errorMessage;
        return this;
    }
    
    raiseError(): void {
        throw new ZapError(this.errorMessage);
    }
}