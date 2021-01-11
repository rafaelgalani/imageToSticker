import { ZapContext } from "../entities"

/* eslint-disable no-return-assign */
const chalk = require('chalk')
const moment = require('moment-timezone')
const updateJson = require('update-json-file')
moment.tz.setDefault('Asia/Jakarta').locale('id')

// Color
export const color = (text, color?) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

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

export const setup = (context: ZapContext) => {
    admins = context.groupAdmins;
};

export const toMention = (number) => {
    if (number.match(new RegExp(/^@\d+$/))){
        return number;
    } else if (number.match(new RegExp(/^\d+@c.us$/))){
        return '@' + number.replace('@c.us', '');
    }
};

export const isAdmin = function(number){
    return admins.includes(number);
};

export const getTitle = function(number){
    return isAdmin(number)? 'admin' : 'membro comum';
};

export const getMentionWithTitle = function(number){
    return `${getTitle(number)} ${toMention(number)}`;
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
    Url,
    Giphy,
    MediaGiphy
};