import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
import { resolvePath } from '../../utils';
export class PoorCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['poor', 'pobre', 'pobrinho', ];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let { target, id } = this.context;
        return await this.context.client.sendFile(target, resolvePath('assets', 'audios', 'pobre.mp3'), 'pobre', 'pobrinho', id, false, true, false);
    }
}