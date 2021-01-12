import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import * as path from 'path';
export class PoctCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['poct'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule(0, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        let { client, chatId } = this.context;
        return await client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/poct.mp3'), 'poct', '', '', false, true, false);
    }
}