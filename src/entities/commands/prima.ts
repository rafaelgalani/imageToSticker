import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
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
        const randomGroupMember = this.context.groupMembers.random();
        await this.context.reply(`O ${this.context.getSenderTitleAndMention()} cacetou a rola na prima do ${this.context.getTitleAndMention(randomGroupMember)}.`)
    }
}