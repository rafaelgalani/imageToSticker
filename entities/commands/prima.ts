import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle, getRandomSexSentence, setup, getMemberNumber, is } from "../../utils";
import { ContactId } from "@open-wa/wa-automate";
export class PrimaCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['prima'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só em grupo.'), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, target, mentionedJidList, sender } = this.context;
        const randomGroupMember = this.context.groupMembers.random();
        await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(sender.id)} cacetou a rola na prima do ${getMentionWithTitle(randomGroupMember)}.`, this.context.id)
    }
}