import { resolvePath } from "../../utils";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class PoctCommand extends ZapCommand {
    
    public getPatterns(){
        return ['poct'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new NArgumentsRule({
                target: 0,
                operation: ArgsOperator.EQ
            }), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile('audios/poct.mp3');
    }
}