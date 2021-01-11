import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMemberNumber } from "../../utils";
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
            //new AdminRule(this.context.args[0]).override('Esse já é adm (teste)') ----> ERRO
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList, args } = this.context;
        const memberNumber = getMemberNumber(args[0]);
        await client.promoteParticipant(groupId, memberNumber || mentionedJidList[0]);
        return await client.sendTextWithMentions(groupId, `Parabenizem o novo adm, @${(memberNumber)? memberNumber.replace('@c.us', '') : mentionedJidList[0]}!!!`)
    }
}