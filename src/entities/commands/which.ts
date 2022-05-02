import { pickRandom } from "src/utils";
import { GroupOnlyRule } from "../rules";
import { ZapCommand } from "./command";

const sentences = [
  `O/A @randomMember, com TOTAL certeza.`,
  `Talvez o/a @randomMember, mas pode ser que não`,
  `Sem sombra de dúvidas, o/a @randomMember`,
  `Essa aí tá ÓBVIO, é o/a @randomMember`,
  `KKKKKKKK ESSA AÍ O/A @randomMember JÁ ME CONFIRMOU NO OFF 🤭`,
];
export class WhichCommand extends ZapCommand {
    
    public getPatterns(){
        return ['qual', 'qual-membro', 'which-member', 'which'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Só pode ser usado em grupo.'), 
        ];
    }

    protected async runSpecificLogic() {
      const members = await this.context.getAllGroupMembersMentions();
      const randomMember = pickRandom( members );
      return await this.context.reply( pickRandom( sentences ).replace( '@randomMember', randomMember ) );
    }
}