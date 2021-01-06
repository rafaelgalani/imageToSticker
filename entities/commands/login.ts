import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { random, toMention } from "../../handler/message/utils";
import { ZapError } from "../core/error";
export class LoginCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['login', 'log', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule(1, ArgsOperator.EQ), 
            /*new ArgumentFormatRule([
                ArgumentFormat.NUMBER,
            ]),*/
        ];
    }

    protected async runSpecificLogic() {
        let { args, sender, client, groupId, from } = this.context;
        let actor = sender.id;
        let randomMinutes = random(24, 260);
        if (Number(args[0]) < 0) throw new ZapError('O cara meteu do loco. Quer voltar no tempo filhão? kkjkjjjjjjj???');

        return await client.sendTextWithMentions(groupId, `${toMention(from)} irá logar em aproximadamente ${randomMinutes + Number(args[0])} minutos.`);
    }
}