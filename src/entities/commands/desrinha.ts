import { GroupOnlyRule, IsFromBotRule } from "../rules";
import { ZapCommand } from "./command";
export class StartRinhaCommand extends ZapCommand {
    
    public getPatterns(){
        return ['desrinha', ];
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
            if ( this.context.isAdmin(member) ) adminResult.push( await this.context.demote(member) );
        }
    
        await Promise.all(adminResult);
    }
}