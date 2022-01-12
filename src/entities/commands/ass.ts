import { ContactId } from "@open-wa/wa-automate";
import { CooldownOptions, Mention, Streak } from "src/types";
import { fullTrim, isMention, loadJSON, pickRandom, randomInt, saveJSON, toContactId } from "src/utils";
import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";

let assDict: Record<number, string> = {};
const initializeAssSentence = () => {

    assDict[0] = `Com apenas {0}% de aproveitamento, o {1} foi tentar comer o cu do {2} e MORREU. SIM, MORREU. É um fudido do caralho, 0%? Vai tomar no cu, cara. Puta que pariu, desiste dessa merda. Dá /salesforce aí arrombado...`;

    for (let i = 1; i <= 10; i++){
        assDict[i] = `Com apenas {0}% de aproveitamento, o {1} foi tentar comer o cu do {2} e teve seu cuzinho comido!!! Uiuiui xD`;
    }
    
    for (let i = 11; i <= 65; i++){
        assDict[i] = `Com apenas {0}% de aproveitamento, o {1} não comeu o cu do {2}.`;
    }

    for(let i = 66; i <= 75; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} QUASE comeu o cu do {2}.`;
    }

    for(let i = 76; i <= 85; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} deu uma rapidinha com o cu do {2}.`;
    }

    for(let i = 86; i <= 90; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} comeu gostoso o cu do {2}!`;
    }

    for(let i = 91; i <= 99; i++) {
        assDict[i] = `Com {0}% de aproveitamento, o {1} comeu gostoso o cu do {2} até esfarelar!`;
    }

    assDict[100] = `Com ilustres {0}% de aproveitamento, o {1} ESTILHAÇOU o cuzão do {2}!!!`;
}

initializeAssSentence();

const getAssSentence = (percentage: number, member: string, target: string) => {
    let sentence = assDict[percentage] ?? assDict[100];

    return sentence.replace('{0}', percentage.toString())
                   .replace('{1}', member)
                   .replace('{2}', target);
};

const assStreakSentences = [
    'Que fodelança maravilhosa!',
    'Que gulosinho!!',
    'Abre pro papai, abre!',
    'Uiui DELICIA!',
    'SEGUUUUUUUUUUUUUUUUURA PEÃOOOOOOO!! DOE A RODELA!',
    'Arreganha o cu!',
];

export const getRandomStreakSentence = () => pickRandom( assStreakSentences );

export class AssCommand extends ZapCommand {
    private data: Record<Mention, Streak>;
    
    static cooldownOptions: CooldownOptions = {
        seconds: 30,
        groupCooldown: true,
    }

    private maxStreaks = 4;

    public getPatterns(){
        return ['ass', 'cu', 'cy', 'cuzin', 'brioco', 'cuzao', 'cuzão' ];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule().override('Mensagem precisa ser enviada em grupo.'), 
            new NArgumentsRule({ target: 1, operation: ArgsOperator.LTE }).override('Um cú de cada vez, né chapa?'), 
            new ArgumentFormatterRule([
                new ArgumentFormat(isMention).override('Os argumentos do comando só podem ser menções.'),
            ])
        ];
    }

    protected override getCooldownMessage(seconds: number) {
        return `Você está broxa. Aguarde ${seconds} segundos para que a pipa suba novamente.`
    }

    addSenderStreak(): Streak{
        this.removeCooldown( this.context.sender.id );
        let previousStreakValue = this.data[this.context.sender.id]?.times ?? 0;
        return this.data[this.context.sender.id] = {
            times: ++previousStreakValue, 
            finished: false,
        };
    }
    
    isSenderInStreak(){
        return this.data[this.context.sender.id] != null;
    }
    
    stopSenderStreak(){
        this.addCooldown( this.context.sender.id );
        return delete this.data[this.context.sender.id];
    }
    
    getSenderStreak(): Streak | null{
        return this.data[this.context.sender.id];
    }

    protected async runSpecificLogic() {
        const { groupId, sender, args } = this.context;

        this.data = loadJSON(`ass-group-${groupId}`) as Record<Mention, Streak>;
        if (!this.data) this.data = {};

        if( args.length === 1 ){

            let randomizedPercentage = randomInt(100);

            if ( this.isSenderInStreak() ){
                randomizedPercentage = randomInt(100, 76);
            }

            let [ target ] = args as Mention[];

            let assSentence = getAssSentence(randomizedPercentage, this.context.getSenderTitleAndMention(), this.context.getTitleAndMention( target ) );

            if (randomizedPercentage < 90){
                if ( this.isSenderInStreak() ){
                    this.stopSenderStreak();
                    assSentence += `\n\nTudo que é bom tem um fim: acabou a sequência de vapo vapo. O ${ this.context.getSenderTitleAndMention() } broxou após degustar esse cuzinho.`;
                }
            } 
            
            if ( this.isSenderInStreak() ) {
                assSentence += ' ' + getRandomStreakSentence();
            }

            if (randomizedPercentage >= 90){
                const streakSequence = this.addSenderStreak();
                if (streakSequence.times === 1){
                    assSentence += '\n\n' + fullTrim(`
                        O ${this.context.getSenderTitleAndMention()} ENTROU EM FRENESI (CU STREAK)!!!

                        - A próxima comida de cu será garantida 🥵🍆
                        - Você tem 40% de chance de continuar em cu streak 💯💦
                        - Você só broxa se sair do cu streak 👎😫
                    `)
                }
            }

            if ( this.getSenderStreak()?.times === this.maxStreaks){
                this.stopSenderStreak();

                assSentence += `\n\nTudo que é bom tem um fim: acabou a sequência de vapo vapo. O ${this.context.getSenderTitleAndMention()} broxou após degustar esse cuzinho.`;
            }

            return await this.saveWithReply(assSentence);
        } else {
            return await this.saveWithReply('marcou ninguém primo? come teu próprio cy aí então zé kkkkkjjjjjjjj.');
        }
         
    }

    private async saveWithReply(message: string){
        saveJSON(`ass-group-${this.context.groupId}`, this.data);
        return await this.context.reply(message);
    }

}