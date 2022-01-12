import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class VavaCommand extends ZapCommand {
    
    public getPatterns(){
        return ['vv', 'vava', 'vavá', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile('audios/vava.mp3');
    }
}