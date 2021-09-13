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
        let { target, id } = this.context;
        return await this.context.client.sendFile(target, resolvePath('assets', 'audios', 'calm.mp3'), 'calma', 'calmou', id, false, true);
    }
}