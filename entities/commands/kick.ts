import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMemberNumber } from "../../utils";
export class KickCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['kick', 'remover', 'ban', 'remove', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new AdminRule(), 
            new BotAdminRule(), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }), 
            new AllowBotArgumentRule(false), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, target, mentionedJidList } = this.context;
        await client.sendReplyWithMentions(target, `Xauuu ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')} xD`, this.context.id)
        for (let i = 0; i < mentionedJidList.length; i++) {
            await client.removeParticipant(groupId, mentionedJidList[i])
        }
    }
}