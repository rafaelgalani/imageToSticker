import { GroupOnlyRule, NArgumentsRule } from "entities/rules";
import { ArgsOperator } from "entities/rules/group/n-arguments";
import { resolvePath } from 'utils';
import { ZapCommand } from "./command";
export class CalmCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['calma', 'calmo', 'calmou', ];
    }

    protected getRules(){
        return [ 
        new GroupOnlyRule(),
        new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }).override('O cara pede calma mas tá emocionado kkkkkjj'), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile(`audios/calm.mp3`);
    }
}