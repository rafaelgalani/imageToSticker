import { isMention } from "src/utils";
import { AdminRule, AllowBotArgumentRule, ArgumentFormat, ArgumentFormatterRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class KickCommand extends ZapCommand {
    
    public getPatterns(){
        return ['kick', 'remover', 'ban', 'remove', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new AdminRule(), 
            new BotAdminRule(), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }), 
            new AllowBotArgumentRule(false), 
            new ArgumentFormatterRule([
                new ArgumentFormat(isMention).override('Os parâmetros do comando só podem ser menções à outros membros.'),
            ])
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList } = this.context;
        await this.context.reply(`Xauuu:\n${this.context.getMentions(true).join(`\n`)}\n\nxD`)

        for (let i = 0; i < mentionedJidList.length; i++) {
            await client.removeParticipant(groupId, mentionedJidList[i])
        }
    }
}