import { ZapCommand } from "./command";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import * as path from 'path';
import { resolvePath } from "../../utils";
export class UepaCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['uepa'];
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
        let { client, target, id } = this.context;
        return await client.sendFile(target, resolvePath('assets', 'audios', 'uepa.mp3'), 'uepa', 'uepa', id, false, true);
    }
}
