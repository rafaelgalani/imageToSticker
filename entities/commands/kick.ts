import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, MustHaveArgumentsRule } from "../rules";
export class KickCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['kick', 'remover', 'ban', 'remove', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new AdminRule(), 
            new BotAdminRule(), 
            new MustHaveArgumentsRule(1), 
            new AllowBotArgumentRule(false), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList } = this.context;
        await client.sendTextWithMentions(groupId, `Xauuu ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')} xD`)
        for (let i = 0; i < mentionedJidList.length; i++) {
            await client.removeParticipant(groupId, mentionedJidList[i])
        }
    }
}