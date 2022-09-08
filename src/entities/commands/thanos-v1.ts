import { IsFromBotRule } from "src/entities/rules";
import { ZapCommand } from "./command";

export class ThanosV1Command extends ZapCommand {
    
    public getPatterns(){
        return ['thanosv1' ];
    }

    protected getRules(){
        return [
          new IsFromBotRule(),
        ];
    }

    protected async runSpecificLogic() {
        const { groupMembers } = this.context;
        const groupMembersWithoutBot = groupMembers.filter(id => id !== this.context.botNumber);
        const kickResult = [];

        for (const member of groupMembersWithoutBot) {
            kickResult.push(await this.context.kick(member));
        }

        await Promise.all(kickResult);

        return await this.context.client.createGroup('THANOS - GRAN FINALE', groupMembersWithoutBot);
    }
}