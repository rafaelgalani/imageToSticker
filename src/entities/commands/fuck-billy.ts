import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
import { resolvePath } from "../../utils";
export class FuckBillyCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['fuckbilly', 'fuckbileta', 'fbilly'];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let { target, id } = this.context;
        let randomFuck = Math.floor(Math.random() * 3) + 1;
        let audio = `fuckbilly${randomFuck}.mp3`;
        return await this.context.client.sendFile(target, resolvePath('assets', 'audios', audio), 'fuckbilly', 'fuckbilly', id, false, true);
    }
}