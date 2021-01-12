import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMemberNumber } from "../../utils";
export class DemoteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['demote', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            //new AdminRule().reverse(true).override('Esse aí já é adm'), 
            new BotAdminRule(), 
            new AllowBotArgumentRule(false), 
            new NArgumentsRule(1, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, target, mentionedJidList } = this.context;
        await client.promoteParticipant(groupId, mentionedJidList[0]);
        return await client.sendReplyWithMentions(target, `Virou pobre @${mentionedJidList[0].replace('@c.us', '')}!!!`, this.context.id);
    }
}