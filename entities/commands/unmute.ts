import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { unmuteMember } from "../../utils";
export class UnmuteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['unmute', 'desmutar'];
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
        unmuteMember(args[0]);
    }
}