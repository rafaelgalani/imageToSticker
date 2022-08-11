import message from "src/handler/message";
import { getRandomElementsFromArray, isNumber } from "src/utils";
import { GroupOnlyRule, IsFromBotRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class Top5Command extends ZapCommand {
    
    public getPatterns(){
        return [ 'top' ];
    }

    protected getRules(){
        return [];
    }

    protected async runSpecificLogic() {
        const members = await this.context.getAllGroupMembersMentions();
        let subjects = this.context.args;
        let limit = 5;

        if ( isNumber( subjects[0] ) ) {
            const quantity = Number(subjects[0]);

            if ( quantity > 0 ) {
                limit = quantity;
                subjects = subjects.slice(1);
            }
        }

        limit = Math.min( members.length, limit );

        const selectedMembers = getRandomElementsFromArray( limit, members );

        const positionToIcon = {
            1: '🥇',
            2: '🥈',
            3: '🥉',
        };

        const getSentence = ( position ) => {
            const icon = positionToIcon[position] ?? "↪";
            return ` -> ${icon} ${position}º lugar: ${selectedMembers[position-1]}`;
        };

        let messageParts = [];

        for( let i = 1; i < limit + 1; i++ ){
            messageParts.push(
                getSentence( i )
            );
        }

        messageParts = [`TOP ${limit} ${ subjects.join(' ') }:`, "", ...messageParts];

        return await this.context.reply( messageParts.join('\n') );
    
    }
}