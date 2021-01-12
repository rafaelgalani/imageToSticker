import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import * as path from 'path';
export class UepaCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['uepa'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule(0, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        let { client, chatId } = this.context;
        return await client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/uepa.mp3'), 'uepa', '', '', false, true, false);
    }
}
