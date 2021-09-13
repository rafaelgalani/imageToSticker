import { getMemberList } from "../../utils";
import { ZapCommand } from "./command";
export class TestCommand extends ZapCommand {
    
    protected getPatterns(){
        return [ 'test', 'teste', ];
    }

    protected getRules(){
        return [ ];
    }

    protected async runSpecificLogic() {
        let { isGroupMsg, chat, target, client, id, groupId } = this.context;
        await client.setGroupEditToAdminsOnly(groupId, true);
        return await client.reply(target, `Tá funcionando xd`, id);
    }
}