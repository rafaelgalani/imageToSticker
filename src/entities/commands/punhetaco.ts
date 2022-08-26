import { fullTrim, getRandomElementsFromArray, pickRandom } from "src/utils";
import { GroupOnlyRule, IsFromBotRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class PunhetacoCommand extends ZapCommand {
    
    public getPatterns(){
        return ["punhetaco", 'punhetaço', 'pupunha'];
    }

    protected getRules(){
        return [ 
            new IsFromBotRule(),
            new GroupOnlyRule().override('Só é permitido em grupos.'), 
            new NArgumentsRule({ target: 0, operation: ArgsOperator.EQ }), 
        ];
    }

    protected async runSpecificLogic() {
        const [ target, ...candidates ] = getRandomElementsFromArray( 5, this.context.groupMembers );
        const candidatesTitleAndMention = candidates.map(a => this.context.getAlias(a));

        const lastMember = candidatesTitleAndMention.pop();
        const candidatesSentence = candidatesTitleAndMention.length? `${candidatesTitleAndMention.join(', ')} e o(a) ${lastMember}` : lastMember;

        await this.context.reply(fullTrim(`
            ATENÇÃO! 
            🍆💦 PUNHETAÇO 🍆💦 pelo banimento do membro ${this.context.getAlias(
              target
            )} do grupo. 

            Confirmados: ${candidatesSentence}.

            O primeiro dos membros acima que realizar, gravar, e enviar no grupo a pupunha em prol do banimento irá receberá 1 mês de adm incontestável e intransferível!
            `));
    }
}