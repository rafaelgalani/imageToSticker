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
        let { isGroupMsg, chat, from, client, id, args } = this.context;
        let target = isGroupMsg? from : chat.id;
        console.log(from);
        return await client.reply(from, `Tá funcionando xd`, id);
    }
}