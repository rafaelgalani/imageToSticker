import { Rule } from "..";
import { ZapContext } from "../core";

export abstract class ZapCommand {
    private eligible: boolean;
    protected context: ZapContext;

    constructor(context: ZapContext){
        this.context = context;
        this.checkEligibility(context.command);
    }

    private checkEligibility(userPattern: string) : boolean{
        this.eligible = false;
        for (let pattern of this.getPatterns()){
            if (userPattern.toLowerCase().trim() === pattern){
                this.eligible = true;
                break;
            }
        }
        return this.eligible;
    }

    public async run(){
        if (!this.eligible) return;

        for (let rule of this.getRules()){
            let isValid = rule.validate(this.context);
            isValid = (rule.reversed? !isValid : isValid)
            if (!isValid){
                rule.raiseError();
            }
        }

        await this.runSpecificLogic();
    }

    protected abstract getPatterns(): string[];
    protected abstract getRules(): Rule[];

    protected abstract runSpecificLogic();
}