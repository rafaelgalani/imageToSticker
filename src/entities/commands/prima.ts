import { pickRandom } from "src/utils";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class PrimaCommand extends ZapCommand {
    
    public getPatterns(){
        return ['prima'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só é permitido em grupos.'), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        const randomGroupMember = pickRandom( this.context.groupMembers );
        await this.context.reply(`O ${this.context.getSenderTitleAndMention()} cacetou a rola na prima do(a) ${this.context.getTitleAndMention(randomGroupMember)}.`)
    }
}