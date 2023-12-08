import { GroupOnlyRule, IsFromBotRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class ForceMentionAllCommand extends ZapCommand {
    
    public getPatterns(){
        return ['forceall'];
    }

    protected getRules(){
        return [ 
            new IsFromBotRule(),
            new GroupOnlyRule(), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.reply(`Os seguintes membros tomaram no cu: ${(await this.context.getAllGroupMembersMentions(true)).join(`\n`)}`);
    }
}