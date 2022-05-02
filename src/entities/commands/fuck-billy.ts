import { randomInt } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class FuckBillyCommand extends ZapCommand {
    
    public getPatterns(){
        return ['fuckbilly', 'fuckbileta', 'fbilly'];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let randomFuck = randomInt(3, 1);
        return await this.context.sendFile(`audios/fuckbilly${randomFuck}.mp3`);
    }
}