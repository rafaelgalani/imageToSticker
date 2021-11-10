import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
import { isMention, randomInt } from "src/utils"

let isMatchActive = false;
let aliveMembers = [];
let matchScore = {};
let randomIndex = -1;
let randomKill = '';
let secondKill = '';

const killMember = target => {
  return aliveMembers.filter(member => member !== target);
}

const doubleKill = (shooter) => {
  do {
    randomIndex = randomInt(aliveMembers.length - 1);
    randomKill = aliveMembers[randomIndex];
  } while (shooter === randomKill);
  aliveMembers = aliveMembers.filter(member => member !== randomKill);
  return randomKill;
}

const checkAliveMembers = target => {
  const isMemberAlive = aliveMembers.find(member => member === target);
  return isMemberAlive ? true : false;
}

export class AssRoyaleCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['cu-royale', 'ass-royale'];
    }

    protected getRules(){
      return [ 
          new GroupOnlyRule().override('Mensagem precisa ser enviada em grupo.'), 
          new NArgumentsRule({ target: 1, operation: ArgsOperator.LTE }).override('Um cú de cada vez, né chapa?'), 
      ];
  }

    protected async runSpecificLogic() {
      const { groupId, sender, args } = this.context;
      console.log('@@@@@@@@@@@@@@@@', sender);
      if (isMatchActive && args[0] === 'alive') {
        return this.context.reply(`Jogadores vivos:\n${aliveMembers.join('\n')}`);
      }
      if (isMatchActive && args[0] === 'cancel' && sender.isMe === true) {
        isMatchActive = false;
        return this.context.reply(`Partida cancelada!`);
      }
      if (args.length === 0) {
        if(!isMatchActive) {
          isMatchActive = true;
          aliveMembers = await this.context.getAllMembersMentioned();
          await this.context.reply(`Um CU Royale foi iniciado com TODOS os membros`);
        } else {
          return await this.context.reply('Já existe uma partida de cu-royale em andamento!');
        }
      } else if (args.length === 1 && !isMatchActive) {
        return await this.context.reply(`O CARA QUER COMER CU FORA DA PARTIDAKKKKKKKKKKK PRA ISSO TEM O /CU ARROMBADO`);
      } else if (args.length === 1) {
        const target = args[0];
        const shooter = `@${sender.id.replace('@c.us', '')}`;
        const isShooterAlive = checkAliveMembers(shooter);
        if (isShooterAlive) {
          const isMemberAlive = checkAliveMembers(target);
          if (isMemberAlive) {
            const percentage = randomInt(100);
            if (percentage <= 10) { 
              aliveMembers = killMember(shooter);
              return this.context.reply(`O ${shooter} tentou comer o cu do ${target} e SE FODEU, TOMOU COUNTER E MORREUKKKKKKKK`);
            } else if (percentage <= 50) {
              return this.context.reply(`O ${shooter} tentou comer o cu do ${target}, mas não obteve sucesso.`);
            } else if (percentage <= 80) {
              aliveMembers = killMember(target);
              return this.context.reply(`O ${shooter} SNIPOU o brioco do ${target}!!!`);
            } else {
              aliveMembers = killMember(target);
              secondKill = doubleKill(shooter);
              return this.context.reply(`O ${shooter} foi tentar comer o cu do ${target} e não apenas COMEU o membro em questão como VAROU, SIM, VAROU!!!!! E ACABOU COMENDO O ${secondKill} JUNTO!`);
            }  
          } else {
            return this.context.reply('O membro já foi de baseKKKKKKKKKKKKKKKKK');
          };
        } else {
          return this.context.reply('Você já está morto e não pode mais comer cu'); 
        }
      }
    }
}

//