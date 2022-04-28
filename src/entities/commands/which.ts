import { randomInt } from "src/utils";
import { GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class NewCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['qual', 'qual-membro', 'which-member', 'which'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
      const members = await this.context.getAllMembersMentioned();
      const memberIndex = randomInt(members.length - 1);
      const randomMember = members[memberIndex];
      const sentences = [
        `O/A ${randomMember}, com TOTAL certeza.`,
        `Talvez o/a ${randomMember}, mas pode ser que não`,
        `Sem sombra de dúvidas, o/a ${randomMember}`,
        `Essa aí tá ÓBVIO, é o/a ${randomMember}`,
        `KKKKKKKK ESSA AÍ O/A ${randomMember} JÁ ME CONFIRMOU NO OFF 🤭`
      ]
      const sentenceIndex = randomInt(sentences.length - 1);
      return await this.context.reply(sentences[sentenceIndex]);
    }
}