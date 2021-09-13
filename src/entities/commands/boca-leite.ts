import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "entities/rules";
import { ArgsOperator } from "entities/rules/group/n-arguments";
import { resolvePath } from 'utils';
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
        let { target, id } = this.context;
        return await this.context.client.sendFile(target, resolvePath('assets', 'audios', 'bocaleite.mp3'), 'boca-leite', 'boca-leite', id, false, true);
    }
}