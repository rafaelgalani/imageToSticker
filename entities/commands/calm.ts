import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ZapCommand } from "./command";
import { resolvePath } from '../../utils';
import { ArgsOperator } from "../rules/group/n-arguments";
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