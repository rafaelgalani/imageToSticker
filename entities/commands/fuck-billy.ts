import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class FuckBillyCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['fuckbilly', ];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let billy = '@5511958795261@c.us'
        return await this.context.client.sendTextWithMentions(this.context.groupId, `${billy}:\nvocê é pobre mano kkk`)
    }
}