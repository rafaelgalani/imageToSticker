import { GroupOnlyRule, NArgumentsRule } from "entities/rules";
import { ArgsOperator } from "entities/rules/group/n-arguments";
import { resolvePath } from 'utils';
import { ZapCommand } from "./command";
export class BocaLeiteCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['boca', 'leite', 'milk', 'mouth', 'milkmouth', 'bocaleite', 'bocadeleite'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile(`audios/boca-leite.mp3`);
    }
}