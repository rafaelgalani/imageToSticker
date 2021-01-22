import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle, setup, memberCuTimeout } from "../../utils";
import moment = require("moment-timezone");
export class AssCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['ass', 'cu', 'cy', 'cuzin', 'brioco', 'cuzao', 'cuzão' ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Mensagem precisa ser enviada em grupo.'), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.LTE }).override('Um cú de cada vez, né chapa?'), 
        ];
    }

    protected async runSpecificLogic() {
        const { sender, args, id, target, client } = this.context;
        setup(this.context);
        const timeOut = memberCuTimeout(sender.id, moment());
        if(timeOut === false) {
            if(args.length === 1){
                let randomizedPercentage = Math.floor(Math.random() * 101);     // returns a random integer from 0 to 100
                let actor = sender.id;
                let targetCuComido = args[0];
                if (randomizedPercentage <= 65) {
                    return await client.sendReplyWithMentions(target, `Com apenas ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} não comeu o cu do ${getMentionWithTitle(targetCuComido)}`, id);
                } else if (randomizedPercentage <= 75) {
                    return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} QUASE comeu o cu do ${getMentionWithTitle(targetCuComido)}`, id);
                } else if (randomizedPercentage <= 85) {
                    return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} deu uma rapidinha com o cu do ${getMentionWithTitle(targetCuComido)}`, id);
                } else if (randomizedPercentage <= 90) {
                    return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} comeu gostoso o cu do ${getMentionWithTitle(targetCuComido)}`, id);
                } else if (randomizedPercentage <= 99) {
                    return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} comeu o cu do ${getMentionWithTitle(targetCuComido)} até esfarelar!`, id);
                } else {
                    return await client.sendReplyWithMentions(target, `Com ilustres ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} ESTILHAÇOU o cuzão do ${getMentionWithTitle(targetCuComido)}`, id);
                }
                // if(actor != natinho){
                //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
                // } else {
                //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de CHEIRAR o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
                // }
            } else {
                return await client.reply(target, 'marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.', id);
            }
        } else {
            return await client.reply(target, `Você está broxa. Aguarde ${timeOut} segundos para que a pipa suba novamente.`, id);
        }
    }
    //     return;
    //     if(args.length === 1){
    //         let randomizedPercentage = Math.floor(Math.random() * 101);     // returns a random integer from 0 to 100
    //         let actor = sender.id;
    //         let targetCuComido = args[0];
    //         if (randomizedPercentage <= 65) {
    //             return await client.sendReplyWithMentions(target, `Com apenas ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} não comeu o cú do ${getMentionWithTitle(targetCuComido)}`, id);
    //         } else if (randomizedPercentage <= 75) {
    //             return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} QUASE comeu o cú do ${getMentionWithTitle(targetCuComido)}`, id);
    //         } else if (randomizedPercentage <= 85) {
    //             return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} deu uma rapidinha com o cú do ${getMentionWithTitle(targetCuComido)}`, id);
    //         } else if (randomizedPercentage <= 90) {
    //             return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} comeu gostoso o cú do ${getMentionWithTitle(targetCuComido)}`, id);
    //         } else if (randomizedPercentage <= 99) {
    //             return await client.sendReplyWithMentions(target, `Com ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} comeu o cú do ${getMentionWithTitle(targetCuComido)} até esfarelar!`, id);
    //         } else {
    //             return await client.sendReplyWithMentions(target, `Com ilustres ${randomizedPercentage}% de aproveitamento, o ${getMentionWithTitle(actor)} ESTILHAÇOU o cuzão do ${getMentionWithTitle(targetCuComido)}`, id);
    //         }
    //         // if(actor != natinho){
    //         //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
    //         // } else {
    //         //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de CHEIRAR o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
    //         // }
    //     } else {
    //         return await client.reply(target, 'marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.', id);
    //     }
    // }
}