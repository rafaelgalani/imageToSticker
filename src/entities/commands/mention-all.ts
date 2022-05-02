import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class MentionAllCommand extends ZapCommand {
    
    public getPatterns(){
        return ['tnc', 'mentionall', 'all', 'todos',];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.reply(`Os seguintes membros tomaram no cu: ${(await this.context.getAllGroupMembersMentions()).join(`\n`)}`);
    }
}