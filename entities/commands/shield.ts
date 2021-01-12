import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { shieldMember } from "../../utils";
export class ShieldCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['shield', 'escudo'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new NArgumentsRule(0, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        const { sender } = this.context;
        const shield = shieldMember(sender.id);
        if (!shield) {
            return await this.context.client.sendReplyWithMentions(this.context.groupId, `O usuário @${sender.id.replace('@c.us', '')} foi protegido.`, this.context.id)
        } else {
            return await this.context.client.sendReplyWithMentions(this.context.groupId, `O usuário @${sender.id.replace('@c.us', '')} já está protegido.`, this.context.id)
        }
    }
}