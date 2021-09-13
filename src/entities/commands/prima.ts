import { getMentionWithTitle } from "../../utils";
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
        const { client, groupId, target, mentionedJidList, sender } = this.context;
        const randomGroupMember = this.context.groupMembers.random();
        await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(sender.id)} cacetou a rola na prima do ${getMentionWithTitle(randomGroupMember)}.`, this.context.id)
    }
}