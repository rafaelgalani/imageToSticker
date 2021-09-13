import { getMentionWithTitle, getRandomSexSentence, is, setup } from "../../utils";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class SexCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sexo', 'sex', 'transa', 'punheta', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new ArgumentFormatterRule([
                new ArgumentFormat(is.Mention).override('Os argumentos do comando só podem ser menções.'),
            ])
        ];
    }

    protected async runSpecificLogic() {
        setup(this.context);

        let { client, args, sender, mentionedJidList, from, id, chatId, groupId } = this.context;
        let actor = sender.id;

        if (args.length > 1) {
            let members = mentionedJidList.map(number => getMentionWithTitle(number)),
                lastMember = members.pop();
            
            let membersSentence = members.length >= 2? `${members.join(', ')} e o ${lastMember}` : `${members[0]} e o ${lastMember}`;
            return await client.sendReplyWithMentions(groupId, `O ${getMentionWithTitle(actor)} ${getRandomSexSentence()} com o ${membersSentence} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`, id)
        } else if (args.length === 1){
            return await client.sendReplyWithMentions(groupId, `O ${getMentionWithTitle(actor)} ${getRandomSexSentence()} com o ${getMentionWithTitle(mentionedJidList[0])} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`, id)
        } else if (args.length === 0){
            return await client.sendReplyWithMentions(groupId, `O ${getMentionWithTitle(actor)} ${getRandomSexSentence()} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`, id)
        }
    }
}