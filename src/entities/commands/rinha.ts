import { GroupOnlyRule, IsFromBotRule } from "../rules";
import { ZapCommand } from "./command";
export class StartRinhaCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['rinha', ];
    }

    protected getRules(){
        return [ 
            new IsFromBotRule(), 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        const { groupMembers } = this.context;
        const adminResult = [];

        for (const member of groupMembers){
            if (! this.context.isAdmin(member) ) adminResult.push( this.context.promote(member) );
        }
    
        await Promise.all(adminResult);

        return await this.context.reply(`*COMEÇOU A RINHA! VALENDO.*`)
    }
}