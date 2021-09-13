import { shieldMember } from "../../utils";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class ShieldCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['shield', 'escudo'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new NArgumentsRule({
                target: 0,
                operation: ArgsOperator.EQ
            }), 
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