import { resolvePath } from "../../utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class FuckBillyCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['fuckbilly', 'fuckbileta', 'fbilly'];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let randomFuck = Math.floor(Math.random() * 3) + 1;
        return await this.context.sendFile(`audios/fuckbilly${randomFuck}.mp3}`);
    }
}