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
    'bateu uma punhetinha', 
    'deu uma gozada gostosa',
    'gozou tudão',
    'alcançou o orgasmo',
    'se deleitou sexualmente',
    'fez uma surubinha safadinha',
];

export const getRandomSexSentence = () => {
    return sexSentences[Math.floor((Math.random() * sexSentences.length))];
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