import { ZapError } from "src/entities/core/error";
import { ArgumentFormat, ArgumentFormatterRule, IsFromBotRule, NArgumentsRule } from "src/entities/rules";
import { ArgsOperator } from "src/entities/rules/group/n-arguments";
import { facebookDownloader } from 'src/lib/downloaders';
import { isUrl } from "src/utils";
import { ZapCommand } from "./command";

export class FTotalCommand extends ZapCommand {
    
    public getPatterns(){
        return ['ftotal', 'ftotalgrupo', 'totalf' ];
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
    }
}