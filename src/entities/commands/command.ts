import { ChatId } from "@open-wa/wa-automate";
import { CooldownOptions } from "src/types";
import { fullTrim, loadJSON, saveJSON } from "src/utils";
import { Rule } from "..";
import { ZapContext, ZapError } from "../core";

export abstract class ZapCommand {
    private eligible: boolean;
    protected context: ZapContext;
    protected cooldownOptions: CooldownOptions;

    constructor(context?: ZapContext, cooldownOptions?: CooldownOptions){
        this.context = context;
        this.cooldownOptions = cooldownOptions;
        this.checkEligibility(context?.command);
    }

    private checkEligibility(userPattern?: string) : boolean{
        if (!userPattern) return this.eligible = false;
        this.eligible = false;
        for (let pattern of this.getPatterns()){
            if (userPattern.toLowerCase().trim() === pattern){
                this.eligible = true;
                break;
            }
        }
        return this.eligible;
    }

    public async run(){
        if (!this.eligible) return;

        for (let rule of this.getRules()){
            let isValid = rule.validate(this.context);
            isValid = (rule.reversed? !isValid : isValid)
            if (!isValid){
                rule.raiseError();
            }
        }

        if (this.cooldownOptions) {
            const [ isCooldownPeriod, seconds ] = this.checkForCooldown();
            if ( !isCooldownPeriod ) return await this.runSpecificLogic();
            else return await this.sendCooldownMessage( seconds );
        } else {
            await this.runSpecificLogic();
        }
    }

    protected abstract getPatterns(): string[];
    
    protected getCooldownMessage(seconds: number): string {
        return `Aguarde ${seconds} segundos para poder executar o comando novamente.`;
    };

    // Returns [true, cooldownTimeInSeconds] if the sender is in cooldown state. 
    // Otherwise, adds cooldown to the sender and returns [ false, 1 ].
    protected checkForCooldown(): [boolean, number] {
        let cooldownHashMap: Record<ChatId, number> = loadJSON( this.getCooldownHashmapName() );
        if ( !cooldownHashMap ) cooldownHashMap = {};

        const member = this.context.from;

        const isMemberInCooldown = member in cooldownHashMap;
        const cooldownTime       = Math.ceil( Math.abs( (new Date().getTime() - new Date(cooldownHashMap[member]).getTime()) / 1000 ) ) ;
        const resetCooldown      = () => cooldownHashMap[member] = new Date().getTime();

        let isCoolingDown;
        // adds/resets cooldown if member never used the command.
        if ( !isMemberInCooldown ) {
            resetCooldown();
            isCoolingDown = false;

        // otherwise...
        } else {

            // Checks whether enough time has passed. If so, then reset the cooldown...
            if ( cooldownTime >= this.cooldownOptions.seconds ) {
                resetCooldown();
                isCoolingDown = false;

            // Otherwise, just return that the member is *still* cooling down.
            } else {
                isCoolingDown = true;
            }
            
        }

        saveJSON( this.getCooldownHashmapName(), cooldownHashMap );
        return [ isCoolingDown, Math.max(Math.abs(cooldownTime - this.cooldownOptions.seconds), 1) ];
    }

    protected async sendCooldownMessage(seconds: number) {
        return await this.context.reply( this.getCooldownMessage( seconds ) );
    }

    public getPatternsAsString(): string {
        return this.getPatterns().map(a => `${ZapContext.COMMAND_PREFIX}${a}`).join(' - ');
    }

    protected getCooldownHashmapName() {
        return this.constructor.name + '-cooldown-hashmap';
    }

    protected getRules(): Rule[] {
        return []
    };

    protected abstract runSpecificLogic();
}



// let assStreak = {};
// let assStreakSentences = [
//     'Que fodelança maravilhosa!',
//     'Que gulosinho!!',
//     'Abre pro papai, abre!',
//     'Uiui DELICIA!',
//     'SEGUUUUUUUUUUUUUUUUURA PEÃOOOOOOO!! DOE A RODELA!',
//     'Arreganha o cu!',
// ];

// export const isMemberInStreak = member => member in assStreak;
// export const addMemberStreak = member => assStreak[member] = (assStreak[member] || 0) + 1;
// export const getMemberStreak = member => assStreak[member];
// export const removeStreak = (member) => delete assStreak[member];
// export const getRandomStreakSentence = () => assStreakSentences[Math.floor((Math.random() * assStreakSentences.length))];

// let votingMap = {};
// export const getVoting = function(voteTarget, groupId){
//     return votingMap?.[groupId]?.[voteTarget]
// }

// export const endVoting = function(voteTarget, groupId){
//     return delete votingMap[groupId][voteTarget]
// };

// export const createVoting = function(voteTarget, groupId, voteActor){
//     let voting = getVoting(voteTarget, groupId);
//     if (voting){
//         throw new ZapError(fullTrim(
//             `Já há um votekick para ${toMention(voteTarget)}. Votação:

//             Banir: ${voting.shouldKick}/${voting.votesNeeded}
//             Não banir: ${voting.shouldKeep}/${voting.votesNeeded}`
//         ));
//     }

//     let votesNeeded = Math.floor( (members.length/2)+1 );
//     if (!votingMap[groupId]) votingMap[groupId] = {}

//     return votingMap[groupId][voteTarget] = {
//         voteTarget,
//         shouldKick: 1,
//         shouldKeep: 0,
//         done: false,
//         votes: [{
//             voteActor,
//             votedForKick: true,
//         }],
//         votesNeeded: 5,
//     };
// };

// export const doVote = function(voteTarget, groupId, voteActorArg, kick=true){
//     let voting = getVoting(voteTarget, groupId);
//     let voteActor = toId(voteActorArg);
//     let vote = voting.votes.find(vote => vote.voteActor === voteActor);
//     if (vote){
//         throw new ZapError(`Seu voto já foi processado, você votou ${vote.votedForKick? 'a favor do ban': 'contra o ban'} do ${toMention(voteTarget)}.`);
//     }

//     voting.votes.push({
//         voteActor,
//         votedForKick: kick
//     });

//     if (kick) voting.shouldKick += 1;
//     else voting.shouldKeep += 1;

//     voting.done = (voting.shouldKick >= voting.votesNeeded) || (voting.shouldKeep >= voting.votesNeeded);
//     voting.kicked = voting.done && voting.shouldKick >= voting.votesNeeded;

//     return voting;
// };

// export const getVote = function(arg){
//     let vote = arg.trim().toLowerCase();

//     let shouldKickValidVotes = ['s', 'y', 'ss', 'sss', 'sim', 'yes', '👍', '👍🏿', '👍🏻', '👍🏽', '👍🏾', '👍🏼'],
//         shouldNotKickValidVotes = ['n', 'n', 'nn', 'no', 'nnn', 'nao', 'não', 'nem', 'ñ', '👎','👎🏻','👎🏼','👎🏽','👎🏾','👎🏿'];

//     if (shouldKickValidVotes.includes(vote)){
//         return true;
//     }

//     if (shouldNotKickValidVotes.includes(vote)){
//         return false;
//     }

//     throw new ZapError(fullTrim(`
//         Voto inválido.
        
//         Votos válidos a favor:
//         ${shouldKickValidVotes.join(', ')}

//         Votos válidos contra:
//         ${shouldNotKickValidVotes.join(', ')}
//     `));
// };

// // Message Filter / Message Cooldowns
// const usedCommandRecently = new Set()

// const isFiltered = (from) => {
//     return !!usedCommandRecently.has(from)
// }

// const addFilter = (from) => {
//     usedCommandRecently.add(from)
//     setTimeout(() => {
//         return usedCommandRecently.delete(from)
//     }, 5000) // 5sec is delay before processing next command
// }

// // Message type Log
// // export const messageLog = (fromMe, type) => updateJson('utils/stat.json', (data) => {
// //     (fromMe) ? (data.sent[type]) ? data.sent[type] += 1 : data.sent[type] = 1 : (data.receive[type]) ? data.receive[type] += 1 : data.receive[type] = 1
// //     return data
// // })

// export const msgFilter = {
//     isFiltered,
//     addFilter
// };


// export const randomInt = (max, min=0) => Math.floor(Math.random() * (max - min + 1)) + min;