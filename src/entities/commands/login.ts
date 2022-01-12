import { randomInt } from "src/utils";
import { ZapError } from "../core/error";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class LoginCommand extends ZapCommand {
    
    public getPatterns(){
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
        const { args } = this.context;
        const [ minutes ] = args;
        if (Number(minutes) < 0) throw new ZapError('O cara meteu do loco. Quer voltar no tempo filhão? kkjkjjjjjjj???');

        const actualMinute = +minutes + 40;
        const randomMinuteDuration = randomInt(actualMinute*5, actualMinute)

        return await this.context.reply(`${this.context.getSenderMention()} irá logar em aproximadamente ${randomMinuteDuration} minutos.`);
    }
}