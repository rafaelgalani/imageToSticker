import { ZapCommand } from "./command";
import { GroupOnlyRule } from "../rules";
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
        let { groupId, target, client, id } = this.context;
        
        let chepo = '@5513991769173@c.us'
        return await client.sendReplyWithMentions(groupId, `${chepo}:\njoga vava?`, id);
    }
}