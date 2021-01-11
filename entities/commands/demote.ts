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
        const { client, groupId, mentionedJidList, args } = this.context;
        const memberNumber = getMemberNumber(args[0]);
        await client.demoteParticipant(groupId, memberNumber || mentionedJidList[0]);
        return await client.sendTextWithMentions(groupId, `Parabenizem o novo membro comum, @${(memberNumber)? memberNumber.replace('@c.us', '') : mentionedJidList[0]}!!!`)
    }
}