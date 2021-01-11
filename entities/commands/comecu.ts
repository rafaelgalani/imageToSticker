import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle, setup, getMemberNumber } from "../../utils";
export class ComeCuCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['cu'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            //new NArgumentsRule(1, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        setup(this.context);
        let { client, args, sender, mentionedJidList, from, id, chatId, groupId, author } = this.context;
        let actor = sender.id
        let randomizedPercentage = Math.floor(Math.random() * 101);;
        const memberNumber = getMemberNumber(args[0]);
        let targetCuComido = mentionedJidList[0];
        console.log(args[0]);
        if (args.length > 0) {
            return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor)} possui ${randomizedPercentage}% de chance de comer o cu do ${getMentionWithTitle(memberNumber || targetCuComido)}. Boa sorte!`)
        } else {
            return await client.sendText(groupId, 'marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.');
        }    
    }
}