import { ArgumentFormat, ArgumentFormatterRule, GroupOnlyRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";
import { loadJSON, randomInt } from "src/utils"

let isMatchActive = false;
let aliveMembers = [];
let matchScore = [{
  player: '',
  kills: 0,
  alive: true
}];
let randomIndex = -1;
let randomKill = '';
let secondKill = '';
let counterKill = false;
let ringClosingIn = 120;
let shootersList = [];

const killMember = (target, shooter, counterKill) => {
  for(let i=0; i < matchScore.length; i++) {
    if (matchScore[i].player === target && !counterKill) {
      matchScore[i].alive = false;
    }
    if (matchScore[i].player === target && counterKill) {
      matchScore[i].kills = matchScore[i].kills + 1;
    }
    if (matchScore[i].player === shooter && !counterKill) {
      matchScore[i].kills = matchScore[i].kills + 1;
    } else if (matchScore[i].player === shooter && counterKill) {
      matchScore[i].alive = false;
    }
  }
  return aliveMembers.filter(member => member !== target);
}

const doubleKill = (shooter) => {
  do {
    randomIndex = randomInt(aliveMembers.length - 1);
    randomKill = aliveMembers[randomIndex];
  } while (shooter === randomKill);
  for(let i=0; i < matchScore.length; i++) {
    if (matchScore[i].player === randomKill) {
      matchScore[i].alive = false;
    }
    if (matchScore[i].player === shooter) {
      matchScore[i].kills = matchScore[i].kills + 1;
    }
  }
  aliveMembers = aliveMembers.filter(member => member !== randomKill);
  return randomKill;
}

const checkAliveMembers = target => {
  const isMemberAlive = aliveMembers.find(member => member === target);
  return isMemberAlive ? true : false;
}

const checkMemberAlias = (member, groupId) => {
  const filename = `aliases-group-${groupId}`;
  const aliasesHashmap = loadJSON<Record<string, string>>(filename);
  const parsedMember = `${member.replace('@', '')}@c.us`
  const aliasesArray = Object.entries(aliasesHashmap);
  for (let i=0; i < aliasesArray.length; i++) {
    if (aliasesArray[i][0] === parsedMember) {
      return aliasesArray[i][1];
    }
  }
  return null;
}
const parseScore = score => {
  return [ score.player, score.kills, score.alive ? '🚶🏻' : '☠️' ].join(' - ');
}

export class AssRoyaleCommand extends ZapCommand {
    
    public getPatterns(){
        return ['royale', 'ass-royale', 'roundsex'];
    }

    protected getRules(){
      return [ 
          new GroupOnlyRule().override('Mensagem precisa ser enviada em grupo.'), 
          new NArgumentsRule({ target: 1, operation: ArgsOperator.LTE }).override('Um cú de cada vez, né chapa?'), 
      ];
  }

    protected async runSpecificLogic() {
      const { groupId, sender, args } = this.context;
      if (isMatchActive && args[0] === 'alive') {
        return this.context.reply(`Jogadores vivos:\n${aliveMembers.join('\n')}`);
      }
      if (isMatchActive && args[0] === 'score') {
        return await this.context.reply(`${matchScore.map(parseScore).join('\n')}`);
      }
      if (isMatchActive && args[0] === 'cancel' && sender.isMe) {
        isMatchActive = false;
        return this.context.reply(`Partida cancelada!`);
      }
      if (args.length === 0) {
        if(!isMatchActive) {
          let test = 10;
          isMatchActive = true;
          aliveMembers = await this.context.getAllMembersMentioned();
          matchScore = aliveMembers.map(player => ({ player, kills: 0, alive: true }));
          await this.context.reply(`Um Round Sex foi iniciado com TODOS os membros`);
          await this.context.sendFile('audios/roundsex.mp3');
          // const intervalId = await setInterval(() => {
          //   this.context.reply(`A partida iniciará em ${test} segundos!`);
          //   test--;
          //   if (test === 0) {
          //     clearInterval(intervalId);
          //   }
          // }, 1000);
          // await setTimeout(() => this.context.reply(`Partida iniciada!`), 11000);
        } else {
          return await this.context.reply('Já existe uma partida de cu-royale em andamento!');
        }
      } else if (args.length === 1 && !isMatchActive) {
        return await this.context.reply(`O CARA QUER COMER CU FORA DA PARTIDAKKKKKKKKKKK PRA ISSO TEM O /CU ARROMBADO`);
      } else if (args.length === 1) {
        const target = args[0];
        const shooter = `@${sender.id.replace('@c.us', '')}`;
        const targetAlias = await checkMemberAlias(target, groupId);
        const shooterAlias = await checkMemberAlias(shooter, groupId);
        if (!shootersList.find(member => member === shooterAlias || shooter)) {
          shootersList.push(shooterAlias || shooter);
        }
        console.log('@@@@@@@@@@@@@@@@@@@', shootersList);
        const isShooterAlive = checkAliveMembers(shooterAlias || shooter);
        if (isShooterAlive) {
          const isMemberAlive = checkAliveMembers(targetAlias || target);
          if (isMemberAlive) {
            const percentage = randomInt(100);
            if (percentage <= 10) {
              counterKill = true; 
              aliveMembers = killMember(targetAlias || target, shooterAlias || shooter, counterKill);
              return this.context.reply(`O *_${shooterAlias || shooter}_* tentou comer o cu do *_${targetAlias || target}_* e SE FODEU, TOMOU COUNTER E MORREUKKKKKKKK`);
            } else if (percentage <= 50) {
              return this.context.reply(`O *_${shooterAlias || shooter}_* tentou comer o cu do *_${targetAlias || target}_*, mas não obteve sucesso.`);
            } else if (percentage <= 80) {
              aliveMembers = killMember(targetAlias || target, shooterAlias || shooter, counterKill);
              return this.context.reply(`O *_${shooterAlias || shooter}_* SNIPOU o brioco do *_${targetAlias || target}_*!!!`);
            } else {
              aliveMembers = killMember(targetAlias || target, shooterAlias || shooter, counterKill);
              secondKill = doubleKill(shooterAlias || shooter);
              return this.context.reply(`O *_${shooterAlias || shooter}_* foi tentar comer o cu do *_${targetAlias || target}_* e não apenas COMEU o membro em questão como VAROU, SIM, VAROU!!!!! E ACABOU COMENDO O *_${secondKill}_* JUNTO!`);
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