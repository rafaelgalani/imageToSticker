import { ZapCommand } from "./command";
import { GroupOnlyRule } from "../rules";
import * as path from 'path';
export class VavaCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['vv', 'vava', 'vavá', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        let { groupId, client,chatId } = this.context;
        
        return await client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/vava.mp3'), 'vava', '', '', false, true, false);
    }
}