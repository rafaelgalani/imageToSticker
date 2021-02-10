import { ZapCommand } from "./command";
import { GroupOnlyRule } from "../rules";
import { resolvePath } from "../../utils";
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
        let { target, id } = this.context;
        return await this.context.client.sendFile(target, resolvePath('assets', 'audios', 'vava.mp3'), 'vava', 'vava', id, false, true);
    }
}