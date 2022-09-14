import { ContactId } from "@open-wa/wa-automate";
import type { Mention } from "src/types";
import { getMemberNumber, isId, isMention, toContactId } from "../../utils";
import { AdminRule, AllowBotArgumentRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class AddMemberCommand extends ZapCommand {
    
    public getPatterns(){
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
        const { client, groupId, args } = this.context;
        const [ personToAdd ] = args;

        if ( isMention(personToAdd) ) {
            return await client.addParticipant(groupId, toContactId(personToAdd));
        } else if ( isId(personToAdd) ) {
            return await client.addParticipant(groupId, personToAdd);
        } else {
            const memberNumber = getMemberNumber(personToAdd, groupId);
            return await client.addParticipant(groupId, toContactId(memberNumber));
        }
    }
}