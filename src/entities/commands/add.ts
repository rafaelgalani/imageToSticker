import { ZapCommand } from "./command";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { getMemberNumber, verifyMute } from "../../utils";
import { ContactId } from "@open-wa/wa-automate";
export class AddMemberCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['add', 'adicionar'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Grupo.'), 
            new AdminRule(), 
            new BotAdminRule(), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }), 
            new AllowBotArgumentRule(false), 
        ];
    }

    protected async runSpecificLogic() {
        const { client, groupId, mentionedJidList, args, author, from, id } = this.context;
        const memberNumber = getMemberNumber(args[0]) as ContactId;
        return await client.addParticipant(groupId, memberNumber);
    }
}