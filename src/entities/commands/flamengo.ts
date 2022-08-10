import { randomInt } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class FlamengoCommand extends ZapCommand {
    
    public getPatterns(){
        return ['fla', 'flamengo', 'framengo'];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile(`audios/flamengo.mp3`);
    }
}