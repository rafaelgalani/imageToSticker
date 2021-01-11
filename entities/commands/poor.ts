import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class PoorCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['poor', 'pobre', 'pobrinho', ];
    }

    protected getRules(){
        return [ new GroupOnlyRule() ];
    }

    protected async runSpecificLogic() {
        let billy = '@5511958795261@c.us'
        return await this.context.client.sendReplyWithMentions(this.context.target, `${billy}:\nvocê é pobre mano kkk`, this.context.id);
    }
}