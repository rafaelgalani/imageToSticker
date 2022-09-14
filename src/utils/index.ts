import { ZapContext, ZapError } from "../entities"
import { resolve } from 'path';
export { default as resizeImage } from './imageProcessing';

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'


import * as chalk from 'chalk'
import { Contact, ContactId, GroupChatId } from "@open-wa/wa-automate";
import { Alias, Mention } from "src/types";
const moment = require('moment-timezone')
const updateJson = require('update-json-file')
moment.tz.setDefault('Asia/Jakarta').locale('id')

function reverseRecord<T extends PropertyKey, U extends PropertyKey>(
  input: Record<T, U>
) {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [value, key])
  ) as Record<U, T>;
}

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
export const isId = (number: string): number is ContactId => Boolean( number.match(new RegExp(Regexes.Id)) );
export const isMention = (number: string): number is Mention => Boolean( number.match(new RegExp(Regexes.Mention)) );
export const isNumber = (number: string) => new RegExp(/\d{1}/).test( number );

export const toMention   = (id: ContactId):    Mention   => `@${id.replace('@c.us', '')}` as Mention;
export const toContactId = (mention: Mention): ContactId => `${mention.substring(1)}@c.us` as ContactId;

export const toAliasOrMention = (id: ContactId, groupId: GroupChatId): Alias | Mention => {
    const aliases = loadJSON< Record< ContactId, Alias > >(`aliases-group-${groupId}`) ?? {};
    return aliases[ id ] ?? `@${id.replace('@c.us', '')}` as Mention;
}

export const toGroupAliasOrMention = (id: ContactId, groupId: GroupChatId): Alias | Mention => {
    const aliases =
      loadJSON<Record<ContactId, Alias>>(`groupaliases-group-${groupId}`) ?? {};
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

export const getMemberNumber = (nickname: string, groupId: GroupChatId) => {
    const memberToGroupNickname =
      loadJSON<Record<Mention, Alias>>(`groupaliases-group-${groupId}`) ?? {};

    const groupNicknameToMember = reverseRecord( memberToGroupNickname );

    return groupNicknameToMember[nickname.toLowerCase()];
}

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