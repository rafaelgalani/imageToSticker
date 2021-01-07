import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import * as path from 'path';
export class BocaLeiteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['boca', 'leite', 'milk', 'mouth', 'milkmouth', 'bocaleite'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule(0, ArgsOperator.EQ), 
        ];
    }

    protected async runSpecificLogic() {
        let { client, chatId } = this.context;
        return await client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/bocaleite.mp3'), 'boca-leite', '', '', false, true, false);
    }
}