import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle, setup } from "../../utils";
export class ComeCuCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['cu'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule(1, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        setup(this.context);
        let natinho = '@5511955541122@c.us'
        let { client, args, sender, mentionedJidList, from, id, chatId, groupId } = this.context;
        let actor = sender.id
        let randomizedPercentage = Math.floor(Math.random() * 101);
        let targetCuComido = mentionedJidList[0]
            if(actor != natinho){
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`)
            } else {
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de CHEIRAR o cu do ${getMentionWithTitle(targetCuComido)}. Boa sorte!`)
            }
    }
}