import { AllowBotArgumentRule, GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class SFCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sf', 'salesforce', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        await this.context.reply('Blz kkkjjjj.');
        return await this.context.removeSender();
    }
}