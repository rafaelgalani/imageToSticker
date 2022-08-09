import { ZapContext, ZapError } from "../entities"
import { resolve } from 'path';
export { default as resizeImage } from './imageProcessing';

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'


import * as chalk from 'chalk'
import { ContactId, GroupChatId } from "@open-wa/wa-automate";
import { Alias, Mention } from "src/types";
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

export const Regexes = {
    URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
    Giphy: /https?:\/\/(www\.)?giphy.com/,
    MediaGiphy: /https?:\/\/media.giphy.com\/media/,
    Id: /^\d+@c.us$/,
    Mention: /^@\d+$/,
}

export const isUrl = (url: string) => Boolean(url.match(new RegExp(Regexes.URL, 'gi')));
export const isGiphy = (url: string) => Boolean(url.match(new RegExp(Regexes.Giphy, 'gi')));
export const isMediaGiphy = (url: string) => Boolean(url.match(new RegExp(Regexes.MediaGiphy, 'gi')));
export const isId = (number: string) => Boolean( number.match(new RegExp(Regexes.Id)) );
export const isMention = (number: string) => Boolean( number.match(new RegExp(Regexes.Mention)) );


export const toMention   = (id: ContactId):    Mention   => `@${id.replace('@c.us', '')}` as Mention;
export const toContactId = (mention: Mention): ContactId => `${mention.substring(1)}@c.us` as ContactId;

export const toAliasOrMention = (id: ContactId, groupId: GroupChatId): Alias | Mention => {
    const aliases = loadJSON< Record< ContactId, Alias > >(`aliases-group-${groupId}`) ?? {};
    return aliases[ id ] ?? `@${id.replace('@c.us', '')}` as Mention;
}

export const loadJSON = <T>( jsonFilename: string, isAssetFile: boolean = false ): T | null => {
    const validateDataFolder = () => !isAssetFile && !existsSync(resolvePath('data')) && mkdirSync(resolvePath('data'));
    const path = ! isAssetFile ? [ 'data' ] : [ 'src', 'assets', 'data' ]

    try {
        validateDataFolder();
        const fileContent = readFileSync(
            resolvePath( ...path, `${jsonFilename}.json`), 
            'utf8'
        )
        return JSON.parse(fileContent);
    } catch {
        return null;
    }
};

export const saveJSON = (jsonFilename: string, content: any) => {
    const contentSerialized = JSON.stringify(content);
    return writeFileSync(
        resolvePath('data', `${jsonFilename}.json`),
        contentSerialized,
        'utf8'
    );
};

export const getRandomString = function() {
    const result           = [];
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++){
        result.push([]);
        for (var j = 0; j < 4; j++ ) {
            result[result.length - 1].push(
                characters.charAt(Math.floor(Math.random() * charactersLength))
            )
        }
        result[result.length - 1] = result[result.length - 1].join('')
    }
    return result.join('-');
}

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

let cooldowns = {};

export const isMemberInCooldown = member => member in cooldowns;
export const getMemberCooldown = member => (60 - moment().diff(cooldowns[member], 'seconds'));
export const addMemberCooldown = (member) => cooldowns[member] = moment();
export const removeMemberCooldown = (member) => delete cooldowns[member];

let assStreak = {};
let assStreakSentences = [
    'Que fodelança maravilhosa!',
    'Que gulosinho!!',
    'Abre pro papai, abre!',
    'Uiui DELICIA!',
    'SEGUUUUUUUUUUUUUUUUURA PEÃOOOOOOO!! DOE A RODELA!',
    'Arreganha o cu!',
];

export const isMemberInStreak = member => member in assStreak;
export const addMemberStreak = member => assStreak[member] = (assStreak[member] || 0) + 1;
export const getMemberStreak = member => assStreak[member];
export const removeStreak = (member) => delete assStreak[member];
export const getRandomStreakSentence = () => assStreakSentences[Math.floor((Math.random() * assStreakSentences.length))];

export const pickRandom = <T>(arr: Array<T>): T => arr[ randomInt(arr.length - 1) ];

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


export const randomInt = (max, min=0) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomElementsFromArray = ( n, array ) => {
    // Shuffle array
    const shuffled = array.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    return shuffled.slice(0, n);
};