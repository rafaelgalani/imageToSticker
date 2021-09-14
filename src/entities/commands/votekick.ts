import { ContactId } from "@open-wa/wa-automate";
// import { createVoting, doVote, endVoting, fullTrim, getVote, is, setup, toMention } from "../../utils";
import { ZapError } from "../core";
import { AllowBotArgumentRule, ArgumentFormat, ArgumentFormatterRule, BotAdminRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
export class VotekickCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['votekick', 'vote', 'voteban', 'votação', 'votar', 'voto'];
    }

    protected getRules(){
        return [ 
            new GroupOnlyRule(), 
            new BotAdminRule().override('Bot precisa ser admin pra fazer votação/kick.'), 
            new AllowBotArgumentRule(false).override('Olha o ban...'), 
            new NArgumentsRule(
                { target: 2, operation: ArgsOperator.LTE },
                { target: 1, operation: ArgsOperator.GTE },
            ), 
            new ArgumentFormatterRule([
                //new ArgumentFormat(isMention, 0).override('Mencione o membro.'),
            ])
        ];
    }

    protected async runSpecificLogic() {
        // setup(this.context);
        // const { id, args, groupId, sender, client, target } = this.context;
        // let votingTarget = args[0] as ContactId;
        
        // try {
        //     let voting = createVoting(args[0], groupId, sender.id);
            
        //     return await client.sendReplyWithMentions(target, fullTrim(`
        //         Votação iniciada, votekick no membro ${toMention(votingTarget)}
                
        //         Banir: ${voting.shouldKick}/${voting.votesNeeded}
        //         Não banir: ${voting.shouldKeep}/${voting.votesNeeded}
        //     `), id);
        // } catch (e){
        //     if (e instanceof ZapError){ // Voting already started. Process vote...
        //         let vote = getVote(args[1] ?? 'sim');
        //         let voting = doVote(votingTarget, groupId, sender.id, vote);

        //         if (!voting.done){
        //             return await client.sendReplyWithMentions(target, fullTrim(`
        //                 Votação atualizada: ${toMention(votingTarget)}
                        
        //                 Banir: ${voting.shouldKick}/${voting.votesNeeded}
        //                 Não banir: ${voting.shouldKeep}/${voting.votesNeeded}
        //             `), id);
        //         } else {
        //             let shouldKick = voting.kicked;

        //             await client.sendReplyWithMentions(target, fullTrim(`
        //                 Votação encerrada: ${toMention(votingTarget)}
                        
        //                 ${shouldKick?  '✅' : '❌'} - Banir: ${voting.shouldKick}/${voting.votesNeeded}
        //                 ${!shouldKick? '✅' : '❌'} - Não banir: ${voting.shouldKeep}/${voting.votesNeeded}
                        
        //                 O membro ${shouldKick? 'será' : 'não será'} banido!!!
        //             `), id);
                    
        //             if (shouldKick) {
        //                 await client.removeParticipant(groupId, votingTarget);
        //             }

        //             endVoting(votingTarget, groupId);
        //         }
        //     }
        // }
    }
}