import { randomInt } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class OddCommand extends ZapCommand {
    
    public getPatterns(){
        return ['chance', 'qualachancede', 'chance', 'odd', 'whataretheodds'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
        const percentage = randomInt(100);
        return await this.context.reply(`${percentage}% de chance.`);
    }
}