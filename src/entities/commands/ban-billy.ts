import { GroupOnlyRule, NArgumentsRule } from "src/entities/rules";
import { ArgsOperator } from "src/entities/rules/group/n-arguments";
import { ZapCommand } from "./command";
import { loadJSON, randomInt, saveJSON } from "src/utils"

export class BanBillyCommand extends ZapCommand {
    
    public getPatterns(){
        return ['xd'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(),
            new NArgumentsRule({ target: 1, operation: ArgsOperator.EQ }).override('Só um número por vez caralho!'), 
        ];
    }

    protected async runSpecificLogic() {
        const { args, sender, client, groupId } = this.context;
        let number = loadJSON<number>( `bill-ban-${groupId}` );
        if (! number ) {
            number = randomInt( 10000 );
            saveJSON( `bill-ban-${groupId}`, number );
        }
        const nick = `@${sender.id.replace('@c.us', '')}`
        const guess = parseInt(args[0]);
        const billy = '5511958795261@c.us'
        if (guess > number) {
          return this.context.reply(`O ${nick} palpitou ${guess}: A resposta está ⬇`);
        }
        if (guess < number) {
          return this.context.reply(`O ${nick} palpitou ${guess}: A resposta está ⬆️`);
        }
        if (guess === number) {
          await this.context.reply(`O ${nick} ACERTOU! ADIVINHA SÓ? BILLY BANIDO IMEDIATAMENTE!`);
          await client.removeParticipant(groupId, billy);
        }
    }
}