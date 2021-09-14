import { random } from "../../handler/message/utils";
import { ZapError } from "../core/error";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class LoginCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['login', 'log', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }).override('Só um número'), 
            new ArgumentFormatterRule([
                new ArgumentFormat(a => !isNaN(Number(a)), 0).override('Burrinho, só número'),
            ]),
        ];
    }

    protected async runSpecificLogic() {
        // let { args, sender, client, groupId, target, from } = this.context;
        // let minutes = Number(args[0]);
        // let actor = sender.id;
        // let randomMinutes = random(24, 260);
        // if (minutes < 0) throw new ZapError('O cara meteu do loco. Quer voltar no tempo filhão? kkjkjjjjjjj???');

        // return await client.sendReplyWithMentions(target, `${toMention(from)} irá logar em aproximadamente ${randomMinutes + minutes} minutos.`, this.context.id);
    }
}