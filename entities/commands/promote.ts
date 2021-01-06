import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
export class PromoteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['promote', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new AdminRule(), 
            new BotAdminRule(), 
            new AllowBotArgumentRule(false), 
            new NArgumentsRule(1, ArgsOperator.EQ), 
            new AdminRule(this.context.args[0]).override('Esse já é adm (teste)')
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList } = this.context;
        await client.promoteParticipant(groupId, mentionedJidList[0]);
        return await client.sendTextWithMentions(groupId, `Parabenizem o novo adm, @${mentionedJidList[0].replace('@c.us', '')}!!!`)
    }
}