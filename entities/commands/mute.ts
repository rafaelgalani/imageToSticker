import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMemberList, muteMember } from "../../utils";
export class MuteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['mute', 'mutar', 'timeout'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new AdminRule(), 
            new BotAdminRule(), 
            new NArgumentsRule(1, ArgsOperator.EQ), 
            new AllowBotArgumentRule(false), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList, args } = this.context;
        muteMember(args[0]);
    }
}