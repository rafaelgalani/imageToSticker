import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class RatinhoCommand extends ZapCommand {
    
    public getPatterns(){
        return ['ratinho'];
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
        return await this.context.sendFile('audios/ratinho.mp3');
    }
}
