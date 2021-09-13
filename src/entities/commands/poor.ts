import { GroupOnlyRule } from "entities/rules";
import { resolvePath } from 'utils';
import { ZapCommand } from "./command";
export class PoorCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['poor', 'pobre', 'pobrinho', ];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        return await this.context.sendFile('audios/pobre.mp3');
    }
}