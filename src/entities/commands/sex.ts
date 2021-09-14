import { isMention, pickRandom } from "src/utils";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, SelfReferenceRule } from "../rules";
import { ZapCommand } from "./command";

export class SexCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sexo', 'sex', 'transa', 'punheta', ];
    }

    private sentences = [
        `bateu uma punhetinha`, 
        `deu uma gozada gostosa`,
        `gozou tudão`,
        `alcançou o orgasmo`,
        `se deleitou sexualmente`,
        `fez uma surubinha safadinha`,
        `descabelou o palhaço`,
    ];

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new SelfReferenceRule(), 
            new ArgumentFormatterRule([
                new ArgumentFormat(isMention).override('Os argumentos do comando só podem ser menções.'),
            ])
        ];
    }

    private buildSexSentence(membersSentence?: string) {
        const messageChunks = [
            `O ${this.context.getSenderTitleAndMention()} ${ pickRandom( this.sentences ) }`,
            (membersSentence? ` com o(a) ${membersSentence} 🥵🥵🥵🥵🥵`: '') + '. ',
            'AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)'
        ];

        return messageChunks.join('');
    }

    protected async runSpecificLogic() {
        
        const members = this.context.getMentionsWithTitle(true);
        const lastMember = members.pop();

        const membersSentence = members.length? `${members.join(', ')} e o(a) ${lastMember}` : lastMember;

        return await this.context.reply(
            this.buildSexSentence(membersSentence)
        )
    }
}