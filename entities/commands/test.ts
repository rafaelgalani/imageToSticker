import { ZapCommand } from "./command";
export class TestCommand extends ZapCommand {
    
    protected getPatterns(){
        return [ 'test', 'teste', ];
    }

    protected getRules(){
        return [ ];
    }

    protected async runSpecificLogic() {
        let { isGroupMsg, chat, from, client, id } = this.context;
        let target = isGroupMsg? from : chat.id;
        return await client.reply(from, `Tá funcionando xd`, id);
    }
}