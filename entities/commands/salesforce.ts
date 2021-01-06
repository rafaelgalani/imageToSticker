import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class SFCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sf', 'salesforce', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    protected async runSpecificLogic() {
        let { sender, groupId, client } = this.context;
        let actor = sender.id;
        await client.sendText(groupId, 'Blz kkkjjjj.');
        return await client.removeParticipant(groupId, actor);
    }
}