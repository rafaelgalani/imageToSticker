import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
import * as path from 'path';
export class PoorCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['poor', 'pobre', 'pobrinho', ];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let { groupId, client,chatId } = this.context;
        return await this.context.client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/pobre.mp3'), 'pobre', '', '', false, true, false);
    }
}