import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
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
        await this.context.reply(`Xauuu:\n${this.context.getMentions().join(`\n`)}\n\nxD`)

        for (let i = 0; i < mentionedJidList.length; i++) {
            await client.removeParticipant(groupId, mentionedJidList[i])
        }
    }
}