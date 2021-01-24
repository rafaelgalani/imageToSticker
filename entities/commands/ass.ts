import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { addMemberCooldown, addMemberStreak, getMemberCooldown, getMemberStreak, getMentionWithTitle, getRandomStreakSentence, isMemberInCooldown, isMemberInStreak, removeMemberCooldown, removeStreak, setup } from "../../utils";
import moment = require("moment-timezone");
import { random } from "../../lib/meme";

let assDict = {};
const initializeAssSentence = () => {
    assDict[0] = `Com apenas {0}% de aproveitamento, o {1} foi tentar comer o cu do {2} e teve seu cuzinho comido!!! Uiuiui xD`
    
    for (let i = 1; i <= 65; i++){
        assDict[i] = `Com apenas {0}% de aproveitamento, o {1} não comeu o cu do {2}.`;
    }

    for(let i = 66; i <= 75; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} QUASE comeu o cu do {2}.`;
    }

    for(let i = 76; i <= 85; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} deu uma rapidinha com o cu do {2}.`;
    }

    for(let i = 86; i <= 90; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} comeu gostoso o cu do {2}!`;
    }

    for(let i = 91; i <= 99; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} comeu gostoso o cu do {2} até esfarelar!`;
    }

    assDict[100] = `Com ilustres {0}% de aproveitamento, o {1} ESTILHAÇOU o cuzão do {2}!!!`;
}

initializeAssSentence();

const getAssSentence = (percentage, member, target) => {
    let sentence = assDict[percentage];
    return sentence.replace('{0}', percentage)
                   .replace('{1}', member)
                   .replace('{2}', target);
};

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
        const { sender, args, id, target, client, isSuperAdmin } = this.context;
        setup(this.context);

        let actor = sender.id;

        if (isMemberInCooldown(actor) && getMemberCooldown(actor) < 0){
            removeMemberCooldown(actor);
        }

        if(!isMemberInCooldown(actor)) {
            if(args.length === 1){

                let randomizedPercentage = Math.floor(Math.random() * 101); // returns a random integer from 0 to 100

                if (isMemberInStreak(actor)){
                    randomizedPercentage = Math.floor(Math.random() * (100 - 76 + 1) + 76);
                }

                let targetCuComido = args[0];

                let assSentence = getAssSentence(randomizedPercentage, getMentionWithTitle(actor), getMentionWithTitle(targetCuComido));

                if (randomizedPercentage < 90){
                    addMemberCooldown(actor);
                    if (isMemberInStreak(actor)){
                        removeStreak(actor);
                        assSentence += `\n\nTudo que é bom tem um fim: acabou a sequência de vapo vapo. O ${getMentionWithTitle(actor)} broxou após degustar esse cuzinho.`;
                    }
                } 
                
                if (isMemberInStreak(actor)){
                    assSentence += ' ' + getRandomStreakSentence();
                }

                if (randomizedPercentage >= 90){
                    addMemberStreak(actor);
                }

                if (getMemberStreak(actor) == 4){
                    addMemberCooldown(actor);
                    removeStreak(actor);
                    assSentence += `\n\nTudo que é bom tem um fim: acabou a sequência de vapo vapo. O ${getMentionWithTitle(actor)} broxou após degustar esse cuzinho.`;
                }

                return await client.sendReplyWithMentions(target, assSentence, id);
                
                // if(actor != natinho){
                //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
                // } else {
                //     return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de CHEIRAR o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`, id)
                // }
            } else {
                return await client.reply(target, 'marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.', id);
            }
        } else {
            return await client.reply(target, `Você está broxa. Aguarde ${getMemberCooldown(actor)} segundos para que a pipa suba novamente.`, id);
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