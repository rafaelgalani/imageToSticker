import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMentionWithTitle } from "../../handler/message/utils"; // TODO: THIS MUST BE MOVED.
export class SexCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sexo', 'sex', 'transa', 'punheta', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        let { client, args, sender, mentionedJidList, groupId, groupAdmins } = this.context;
        let actor = sender.id;
        if (args.length > 1) {
            let members = mentionedJidList.map(number => getMentionWithTitle(number, groupAdmins)),
                lastMember = members.pop();
            
            let membersSentence = members.length >= 2? `${members.join(', ')} e o ${lastMember}` : `${members[0]} e o ${lastMember}`;
            return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} fez uma surubinha com o ${membersSentence} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
        } else if (args.length === 1){
            return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} comeu o ${getMentionWithTitle(mentionedJidList[0], groupAdmins)} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
        } else if (args.length === 0){
            return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} bateu uma punhetinha 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
        } else {
            return await client.sendText(groupId, 'AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)')
        }
    }
}