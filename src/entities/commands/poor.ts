import { GroupOnlyRule } from "src/entities/rules";
import { resolvePath } from 'src/utils';
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