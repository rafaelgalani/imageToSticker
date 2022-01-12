import { getRandomString } from "src/utils"; // TODO: THIS MUST BE MOVED.
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";
export class CodeCommand extends ZapCommand {
    
    public getPatterns(){
        return ['code', 'codigo', 'codiguin', ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
        ];
    }

    private buildSentence(code: string, membersSentence?: string) {
        const messageChunks = [
            `O ${this.context.getSenderTitleAndMention()} `,
            (membersSentence? 
                `enviou um codiguin para ${ membersSentence }.\n` : 
                `solicitou um codiguin.\n`
            ),
            `Tá aí tropinha!\n`,
            `Codiguin:\n`,
            code.toUpperCase(),
        ];

        return messageChunks.join('');
    }

    protected async runSpecificLogic() {
        const code = getRandomString();

        const members = this.context.getMentionsWithTitle(true);
        const lastMember = members.pop();

        const membersSentence = members.length? `${members.join(', ')} e o(a) ${lastMember}` : lastMember;

        return await this.context.reply(
            this.buildSentence(code, membersSentence)
        )
    }
}