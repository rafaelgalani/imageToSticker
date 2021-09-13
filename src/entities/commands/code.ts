import { getId, getMentionWithTitle } from "../../handler/message/utils"; // TODO: THIS MUST BE MOVED.
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class CodeCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['code', 'codigo', 'codiguin', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        let { client, args, sender, mentionedJidList, target, groupAdmins } = this.context;
        let code = getId();
        let actor = sender.id;

        if (args.length > 1) {
            let members = mentionedJidList.map(number => getMentionWithTitle(number, groupAdmins)),
                lastMember = members.pop();
                
            let membersSentence = members.length >= 2? `${members.join(', ')} e o ${lastMember}` : `${members[0]} e o ${lastMember}`;
            return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor, groupAdmins)} enviou um codiguin para o ${membersSentence}. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`, this.context.id)
        } else if (args.length === 1){
            return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor, groupAdmins)} enviou um codiguin para o ${getMentionWithTitle(mentionedJidList[0], groupAdmins)}. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`, this.context.id)
        } else if (args.length === 0){
            return await client.sendReplyWithMentions(target, `O ${getMentionWithTitle(actor, groupAdmins)} solicitou um codiguin. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`, this.context.id)
        }
    }
}