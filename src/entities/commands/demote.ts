import { isMention, toMention } from "src/utils";
import { AdminRule, AllowBotArgumentRule, ArgumentFormat, ArgumentFormatterRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class DemoteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['demote', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new AdminRule(), 
            new BotAdminRule(), 
            new AllowBotArgumentRule(false), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }).override('Só um membro de cada vez'), 
            new ArgumentFormatterRule([
                new ArgumentFormat(isMention).override('Os argumentos do comando só podem ser menções.'),
            ])
        ];
    }

    protected async runSpecificLogic() {
        const [ target ] = this.context.mentionedJidList;
        if (!this.context.isAdmin(target)) return await this.context.reply(`O ${toMention(target)} já é pobre.`);
        await this.context.demote(target);
        return await this.context.reply(`Virou pobre, ${toMention(target)}!!! Perdeu tudo e está morando de aluguel.`)
    }
}