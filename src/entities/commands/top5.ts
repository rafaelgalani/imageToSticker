import message from "src/handler/message";
import { getRandomElementsFromArray } from "src/utils";
import { GroupOnlyRule, IsFromBotRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class Top5Command extends ZapCommand {
    
    public getPatterns(){
        return ['top5', ];
    }

    protected getRules(){
        return [];
    }

    protected async runSpecificLogic() {
        const members = await this.context.getAllGroupMembersMentions();
        const [ first, second, third, fourth, fifth ] = getRandomElementsFromArray( 5, members );
        const subjects = this.context.args;

        let messageParts = [];

        if ( first ) 
            messageParts.push( ` -> 🥇 1º lugar: ${ first }` );
        if ( second ) 
            messageParts.push( ` -> 🥈 2º lugar: ${ second }` );
        if ( third ) 
            messageParts.push( ` -> 🥉 3º lugar: ${ third }` );
        if ( fourth ) 
            messageParts.push( ` -> ↪ 4º lugar: ${ fourth }` );
        if ( fifth ) 
            messageParts.push( ` -> ↪ 5º lugar: ${ fifth }` );

        messageParts = [`TOP 5 ${ subjects.join(' ') }:`, "", ...messageParts];

        return await this.context.reply( messageParts.join('\n') );
    
    }
}