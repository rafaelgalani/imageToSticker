export class ZapError extends Error {
    public constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, ZapError.prototype);
    }
}