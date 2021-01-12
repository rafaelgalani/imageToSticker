import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import * as path from 'path';
import { resolvePath } from "../../utils";
export class PoctCommand extends ZapCommand {
    
    protected getPatterns(){
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
        let { client, id, target } = this.context;
        return await client.sendFile(target, resolvePath('assets', 'audios', 'poct.mp3'), 'poct', 'poct', id, false, true, false);
    }
}