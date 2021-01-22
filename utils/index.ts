import { ZapContext, ZapError } from "../entities"
import { resolve } from 'path';
export { default as resizeImage } from './imageProcessing';

/* eslint-disable no-return-assign */
const chalk = require('chalk')
const moment = require('moment-timezone')
const updateJson = require('update-json-file')
moment.tz.setDefault('Asia/Jakarta').locale('id')

export const resolvePath = (...args) => resolve(...args);
// Color
export const color = (text, color?) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

export const fullTrim = function(text: string){
    return text.trim().replace(/( |\t|\r){2,}/g, '');
};

export const processTime = (timestamp, now) => {
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

// is Url?
const Url = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const Giphy = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
}

const MediaGiphy = (url) => {
    return url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
}

let admins = [];
let members = [];

export const setup = (context: ZapContext) => {
    admins = context.groupAdmins;
    members = context.groupMembers;
};

const isId = number => !!number.match(new RegExp(/^\d+@c.us$/));
const isMention = number => !!number.match(new RegExp(/^@\d+$/));

export const toMention = (number) => {
    if (isMention(number)){
        return number;
    } else if (isId(number)){
        return '@' + number.replace('@c.us', '');
    }
};

export const toId = (number) => {
    if (isId(number)) {
        return number;
    } else if (isMention(number)){
        return number.substring(1) + '@c.us';
    }
};

export const isAdmin = function(number){
    return admins.includes(number);
};

export const getTitle = function(number){
    return isAdmin(number)? 'admin' : 'membro comum';
};

export const getMentionWithTitle = function(number){
    let targetNumber = toId(number);
    return `${getTitle(targetNumber)} ${toMention(targetNumber)}`;
};

const sexSentences = [
    `bateu uma punhetinha`, 
    `deu uma gozada gostosa`,
    `gozou tudão`,
    `alcançou o orgasmo`,
    `se deleitou sexualmente`,
    `fez uma surubinha safadinha`,
    `descabelou o palhaço`,
]

export const getRandomSexSentence = () => {
    return sexSentences[Math.floor((Math.random() * sexSentences.length))];
};

const membersList = [
    {
        "name": "Gabriel Botta",
        "nicknames": ['botta', 'boot'],
        "number": "5511954975348@c.us",
        "mute": false
    },
    {
        "name": "Matheus Izidio",
        "nicknames": ['eli', 'izidio'],
        "number": "5511983339646@c.us",
        "mute": false
    },
    {
        "name": "João Pedro Cruz",
        "nicknames": ['saude', 'saúde', 'geno', 'health'],
        "number": "5511966266400@c.us",
        "mute": false
    },
    {
        "name": "Gabriel Casarotti",
        "nicknames": ['nitt', 'casarotti'],
        "number": "5511985997100@c.us",
        "mute": false
    },
    {
        "name": "Rafael Galani",
        "nicknames": ['raga', 'rafa', 'galani'],
        "number": "5511945043226@c.us",
        "mute": false
    },
    {
        "name": "Pedro Gatto",
        "nicknames": ['gatto', 'cat', 'catt'],
        "number": "5511987346469@c.us",
        "mute": false
    },
    {
        "name": "João Vitor Luchezzi",
        "nicknames": ['fagundes', 'gundao', 'luchezzi'],
        "number": "5511952265051@c.us",
        "mute": false
    },
    {
        "name": "Marcio Junior",
        "nicknames": ['junin', 'marcio', 'marcinho'],
        "number": "5511991668233@c.us",
        "mute": false
    },
    {
        "name": "Mariana Yamanaka",
        "nicknames": ['mari', 'yamanaka'],
        "number": "5511991399669@c.us",
        "mute": false
    },
    {
        "name": "Nychollas Dellamonica",
        "nicknames": ['metela', 'dellamonica'],
        "number": "5511953796932@c.us",
        "mute": false
    },
    {
        "name": "Gabriel Pazin",
        "nicknames": ['billy', 'monduzzi', 'pazin', 'lubilas'],
        "number": "5511958795261@c.us",
        "mute": false
    },
    {
        "name": "Renato Honório",
        "nicknames": ['natinho', 'renato', 'natin'],
        "number": "5511955541122@c.us",
        "mute": false
    },
    {
        "name": "Klisman Cruz",
        "nicknames": ['xep', 'xepo', 'chepolino', 'chepo', 'chep', 'klisman'],
        "number": "5513991769173@c.us",
        "mute": false
    },
    {
        "name": "Caio Pacini",
        "nicknames": ['caio', 'pacini', 'xpranked'],
        "number": "5511987808222@c.us",
        "mute": false
    },
    {
        "name": "Rodrigo Pazin",
        "nicknames": ['rodrigo', 'sapo'],
        "number": "5511970207129@c.us",
        "mute": false
    },
    {
        "name": "Enrico",
        "nicknames": ['enrico', 'rico'],
        "number": "5511976498140@c.us",
        "mute": false
    },
    {
        "name": "Alexandre Nunes",
        "nicknames": ['frank', 'franke', 'cherakull'],
        "number": "5511996674358@c.us",
        "mute": false
    },
    {
        "name": "Fernando Lao",
        "nicknames": ['fernando', 'lao'],
        "number": "5511973062236@c.us",
        "mute": false
    }
]

export const getMemberList = () => {
    return membersList;
}

export const getMemberNumber = (nickname) => {
    const memberList = getMemberList();
    for (let j = 0; j < memberList.length; j++) {
        for (let i = 0; i < memberList[j].nicknames.length; i++) {
            if (nickname.toLowerCase() === memberList[j].nicknames[i]) {
                return memberList[j].number;
            }
        }
    }
}

export const muteMember = (nickname) => {
    const memberList = getMemberList();
    for (let j = 0; j < memberList.length; j++) {
        for (let i = 0; i < memberList[j].nicknames.length; i++) {
            if (nickname.toLowerCase() === memberList[j].nicknames[i]) {
                memberList[j].mute = true;
                console.log('MUTE:\nMute:', memberList[j].mute);
            }
        }
    }
}

export const unmuteMember = (nickname) => {
    const memberList = getMemberList();
    for (let j = 0; j < memberList.length; j++) {
        for (let i = 0; i < memberList[j].nicknames.length; i++) {
            if (nickname.toLowerCase() === memberList[j].nicknames[i]) {
                memberList[j].mute = false;
                console.log('UNMUTE:\nMute:', memberList[j].mute);
            }
        }
    }
}

export const verifyMute = (author) => {
    const memberList = getMemberList();
    for (let j = 0; j < memberList.length; j++) {
        if (memberList[j].number === author) {
            return memberList[j].mute;
        }
    }
}

export let shieldedList = [];

export const getShieldedList = () => {
    return shieldedList;
}

export const shieldMember = (author) => {
    const shieldedList = getShieldedList();
    const isMemberShielded = !!shieldedList.find(i => i === author)
    if(!isMemberShielded) {
        shieldedList.push(author);
        console.log("Membro protegido");
    } else {
        console.log("Membro já foi protegido");
    }
    console.log(shieldedList);
    return isMemberShielded;
}

export let cuTimeout = [];

export const getCuTimeout = () => {
    return cuTimeout;
}

export const memberCuTimeout = (author, time) => {
    const cuTimeout = getCuTimeout();
    const isMemberTimedOut = !!cuTimeout.find(i => i.number === author);
    if(!isMemberTimedOut) {
        cuTimeout.push({"number": author, "time": time});
        console.log("Adicionou")
        return false;
    } else {
        const timeOutIndex = cuTimeout.findIndex(i => i.number === author);
        const timeOutMoment = cuTimeout[timeOutIndex].time;
        const timeLeft = moment().diff(timeOutMoment, 'seconds');
        if (timeLeft <= 300) {
            return (300 - timeLeft);
        } else {
            cuTimeout.splice(timeOutIndex, 1);
            cuTimeout.push({"number": author, "time": time});
            return false;
        }
    }
}

let votingMap = {};
export const getVoting = function(voteTarget, groupId){
    return votingMap?.[groupId]?.[voteTarget]
}

export const endVoting = function(voteTarget, groupId){
    return delete votingMap[groupId][voteTarget]
};

export const createVoting = function(voteTarget, groupId, voteActor){
    let voting = getVoting(voteTarget, groupId);
    if (voting){
        throw new ZapError(fullTrim(
            `Já há um votekick para ${toMention(voteTarget)}. Votação:

            Banir: ${voting.shouldKick}/${voting.votesNeeded}
            Não banir: ${voting.shouldKeep}/${voting.votesNeeded}`
        ));
    }

    let votesNeeded = Math.floor( (members.length/2)+1 );
    if (!votingMap[groupId]) votingMap[groupId] = {}

    return votingMap[groupId][voteTarget] = {
        voteTarget,
        shouldKick: 1,
        shouldKeep: 0,
        done: false,
        votes: [{
            voteActor,
            votedForKick: true,
        }],
        votesNeeded: 5,
    };
};

export const doVote = function(voteTarget, groupId, voteActorArg, kick=true){
    let voting = getVoting(voteTarget, groupId);
    let voteActor = toId(voteActorArg);
    let vote = voting.votes.find(vote => vote.voteActor === voteActor);
    if (vote){
        throw new ZapError(`Seu voto já foi processado, você votou ${vote.votedForKick? 'a favor do ban': 'contra o ban'} do ${toMention(voteTarget)}.`);
    }

    voting.votes.push({
        voteActor,
        votedForKick: kick
    });

    if (kick) voting.shouldKick += 1;
    else voting.shouldKeep += 1;

    voting.done = (voting.shouldKick >= voting.votesNeeded) || (voting.shouldKeep >= voting.votesNeeded);
    voting.kicked = voting.done && voting.shouldKick >= voting.votesNeeded;

    return voting;
};

export const getVote = function(arg){
    let vote = arg.trim().toLowerCase();

    let shouldKickValidVotes = ['s', 'y', 'ss', 'sss', 'sim', 'yes', '👍', '👍🏿', '👍🏻', '👍🏽', '👍🏾', '👍🏼'],
        shouldNotKickValidVotes = ['n', 'n', 'nn', 'no', 'nnn', 'nao', 'não', 'nem', 'ñ', '👎','👎🏻','👎🏼','👎🏽','👎🏾','👎🏿'];

    if (shouldKickValidVotes.includes(vote)){
        return true;
    }

    if (shouldNotKickValidVotes.includes(vote)){
        return false;
    }

    throw new ZapError(fullTrim(`
        Voto inválido.
        
        Votos válidos a favor:
        ${shouldKickValidVotes.join(', ')}

        Votos válidos contra:
        ${shouldNotKickValidVotes.join(', ')}
    `));
};

// Message Filter / Message Cooldowns
const usedCommandRecently = new Set()

const isFiltered = (from) => {
    return !!usedCommandRecently.has(from)
}

const addFilter = (from) => {
    usedCommandRecently.add(from)
    setTimeout(() => {
        return usedCommandRecently.delete(from)
    }, 5000) // 5sec is delay before processing next command
}

// Message type Log
export const messageLog = (fromMe, type) => updateJson('utils/stat.json', (data) => {
    (fromMe) ? (data.sent[type]) ? data.sent[type] += 1 : data.sent[type] = 1 : (data.receive[type]) ? data.receive[type] += 1 : data.receive[type] = 1
    return data
})

export const msgFilter = {
    isFiltered,
    addFilter
};

export const is = {
    Id: isId,
    Mention: isMention,
    Url,
    Giphy,
    MediaGiphy
};