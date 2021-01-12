import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle, setup } from "../../utils";
export class AssCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['ass', 'cu', 'cy', 'cuzin', 'brioco', 'cuzao', 'cuzão' ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Mensagem precisa ser enviada em grupo.'), 
            new NArgumentsRule(1, ArgsOperator.LTE).override('Um cú de cada vez, né chapa?'), 
        ];
    }

    protected async runSpecificLogic() {
        const { sender, args, id, target, client } = this.context;
        setup(this.context);
        if(args.length === 1){
            let randomizedPercentage = Math.floor(Math.random() * 101);     // returns a random integer from 0 to 100
            let actor = sender.id;
            let targetCuComido = args[0];
            let natinho = '5511955541122@c.us'
            if(actor != natinho){
                return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
            } else {
                return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de CHEIRAR o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
            }
        } else {
            return await client.reply(target, 'marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.', id);
        }
    }
}