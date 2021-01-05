import { ZapError, ZapContext } from "../core";

export abstract class Rule {
    protected error: ZapError;
    abstract validate(context: ZapContext): boolean;
    raiseError(): void {
        throw this.error;
    }
}