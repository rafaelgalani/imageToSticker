/* eslint-disable */ 
require('dotenv').config()
import { decryptMedia, Client } from '@open-wa/wa-automate'
import * as moment from 'moment-timezone'
moment.tz.setDefault('Asia/Jakarta').locale('id')
//import { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData } from '../../lib';
import { msgFilter, color, processTime, is } from '../../utils';
import { uploadImages } from '../../utils/fetcher';
import { toMention, getMentionWithTitle, getId, random, createVoting, doVote, getVote } from './utils';
import { menuId, menuEn } from './text'; // Indonesian & English men;
import * as path from 'path';

const votingMap = {};

export class ZapError extends Error {
    public constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, ZapError.prototype);
    }
}

export default async (client: Client, message) => {
    try {
        let { type, id, from, fromMe, to, t, sender, isGroupMsg, chat, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, chatId } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : []
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : []
        const isGroupAdmins = groupAdmins.includes(sender.id)
        const isBotGroupAdmins = groupAdmins.includes(botNumber)

        // Bot Prefix
        const prefix = '/'
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = process.env.UserAgent

        // [BETA] Avoid Spam Message
        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        //
        if (!isCmd && !isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname)) }
        if (!isCmd && isGroupMsg) { return console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        // [BETA] Avoid Spam Message
        //msgFilter.addFilter(from)
        
        // if (pushname === 'Você'){
        //     if (!isGroupMsg){
        //         let aux = from;
        //         from = to;
        //         to = aux;
        //     } else {
        //         let aux = from;
        //         from = to;
        //         to = aux;
        //     }
        // };

        switch (command) {
        // Menu and TnC
        case 'speed':
        case 'ping':
            // await client.sendText(from, `Pong!!!!\nSpeed: ${processTime(t, moment())} _Secon jb teste d_`)
            break
        // case 'tnc':
        //     await client.sendText(from, menuId.textTnC())
        //     break
        case 'menu':
        case 'help':
            // await client.sendText(from, menuId.textMenu(pushname))
            //     .then(() => ((isGroupMsg) && (isGroupAdmins)) ? client.sendText(from, 'Menu Admin Grup: *#menuadmin*') : null)
            break
        case 'menuadmin':
            // if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            // if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            // await client.sendText(from, menuId.textAdmin())
            break
        case 'donate':
        case 'donasi':
            // await client.sendText(from, menuId.textDonasi())
            break
        // Sticker Creator
        case 'sticker':
        case 'stiker': {
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                let stickerTarget = isGroupMsg? groupId : chat.id;
                await client.sendImageAsSticker(stickerTarget, imageBase64);
                await client.reply(stickerTarget, 'Tá aí.', id)
                console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
            } else if (args[0] === 'nobg') {
                /**
                * This is Premium feature.
                * Check premium feature at https://trakteer.id/red-emperor/showcase or chat Author for Information.
                */
                client.reply(from, 'xd', id)
            } else if (args.length === 1) {
                if (!is.Url(url)) { 
                    await client.reply(from, 'Link inválido...', id) 
                }
                const result = await client.sendStickerfromUrl(from, url);
                
                if (!result && result !== undefined){
                    return await client.sendText(from, 'Imagem inválida.');
                }

                await client.reply(from, 'Tá aí.', id);
                console.log(`Sticker processed for ${processTime(t, moment())} seconds.`)

            } else {
                await client.reply(from, 'Comando no formato errado.', id)
            }
            break
        }
        case 'kick':
            try {
                if (!isGroupMsg) throw new ZapError('Só funciona em grupo.');
                if (!isGroupAdmins) throw new ZapError('Precisa ser admin.');
                if (!isBotGroupAdmins) throw new ZapError('O bot não é admin.');
                if (mentionedJidList.length === 0) throw new ZapError('Kd os membros irmão');
                if (mentionedJidList[0] === botNumber) throw new ZapError('Cheirou meia.');
                await client.sendTextWithMentions(groupId, `Xauuu ${mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join('\n')} xD`)
                for (let i = 0; i < mentionedJidList.length; i++) {
                    //if (groupAdmins.includes(mentionedJidList[i])) return await client.sendText(from, "You can't kick an admin.")
                    await client.removeParticipant(groupId, mentionedJidList[i])
                }
                return;
            } catch (e) {
                console.error(color(e, 'red'));
                if (e instanceof ZapError){
                    return await client.reply(from, e.message, id);
                }
                return await client.reply(from, 'bugou algo.', id);
            }
        case 'promote':
            try {
                if (!isGroupMsg) throw new ZapError('Só funciona em grupo.');
                if (!isGroupAdmins) throw new ZapError('Precisa ser admin.');
                if (!isBotGroupAdmins) throw new ZapError('O bot não é admin.');
                if (mentionedJidList.length !== 1) throw new ZapError('Só um promote por vez.');
                if (groupAdmins.includes(mentionedJidList[0])) throw new ZapError('Esse aí já é adm kkjjj');
                if (mentionedJidList[0] === botNumber) throw new ZapError('Cheirou meia.');
                await client.promoteParticipant(groupId, mentionedJidList[0]);
                return await client.sendTextWithMentions(groupId, `Parabenizem o novo adm, @${mentionedJidList[0].replace('@c.us', '')}!!!`)
            } catch (e) {
                console.error(color(e, 'red'));
                if (e instanceof ZapError){
                    return await client.reply(from, e.message, id);
                }
                return await client.reply(from, 'bugou algo.', id);
            }
        case 'demote':
            try {
                if (!isGroupMsg) throw new ZapError('Só funciona em grupo.');
                if (!isGroupAdmins) throw new ZapError('Precisa ser admin.');
                if (!isBotGroupAdmins) throw new ZapError('O bot não é admin.');
                if (mentionedJidList.length !== 1) throw new ZapError('Só um demote por vez.');
                if (!groupAdmins.includes(mentionedJidList[0])) throw new ZapError('Esse aí já é membro comum kkkjjjj');
                if (mentionedJidList[0] === botNumber) throw new ZapError('Cheirou meia.');
                await client.demoteParticipant(groupId, mentionedJidList[0])
                return await client.sendTextWithMentions(groupId, `@${mentionedJidList[0].replace('@c.us', '')} virou pobre.`)
            } catch (e) {
                console.error(color(e, 'red'));
                if (e instanceof ZapError){
                    return await client.reply(from, e.message, id);
                }
                return await client.reply(from, 'bugou algo.', id);
            }
        case 'codiguin': {
            if (!isGroupMsg) break;
            let code = getId();
            let actor = sender.id;

            if (args.length > 1) {
                let members = mentionedJidList.map(number => getMentionWithTitle(number, groupAdmins)),
                    lastMember = members.pop();
                
                let membersSentence = members.length >= 2? `${members.join(', ')} e o ${lastMember}` : `${members[0]} e o ${lastMember}`;
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} enviou um codiguin para o ${membersSentence}. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`)
            } else if (args.length === 1){
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} enviou um codiguin para o ${getMentionWithTitle(mentionedJidList[0], groupAdmins)}. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`)
            } else if (args.length === 0){
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} solicitou um codiguin. Tá aí tropinha!\nCodiguin: \n${code.toUpperCase()}`)
            }
            
            break
        }
        case 'sexo': {
            if (!isGroupMsg) break;
            let actor = sender.id;
            if (args.length > 1) {
                let members = mentionedJidList.map(number => getMentionWithTitle(number, groupAdmins)),
                    lastMember = members.pop();
                
                let membersSentence = members.length >= 2? `${members.join(', ')} e o ${lastMember}` : `${members[0]} e o ${lastMember}`;
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} fez uma surubinha com o ${membersSentence} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
            } else if (args.length === 1){
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} comeu o ${getMentionWithTitle(mentionedJidList[0], groupAdmins)} 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
            } else if (args.length === 0){
                return await client.sendTextWithMentions(groupId, `O ${getMentionWithTitle(actor, groupAdmins)} bateu uma punhetinha 🥵🥵🥵🥵🥵. AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)`)
            } else {
                return await client.sendText(groupId, 'AHHHHHNNNNN AWNNNNNN AHHHHHHHNNNNN (sexo)')
            }
        }
        case 'salesforce':{
            let actor = sender.id;
            await client.sendText(groupId, 'Blz kkkjjjj.');
            return await client.removeParticipant(groupId, actor);
        }
        case 'uepa':{
            return await client.sendFile(chatId, path.resolve(__dirname, '../../assets/audios/uepa.mp3'), 'uepa', '', '', false, true, false);
        }
        case 'comandos':{
            return await client.sendText(groupId, '       _*Comandos disponíveis:*_ \n /sexo [membro1], [membro2]... \n /kick @membro _(apenas admin)_ \n /promote @membro_comum _(apenas admin)_ \n /demote @admin _(apenas admin)_ \n /codiguin [membro1] [membro2]... \n /salesforce \n /comandos \n /vava \n /tnc \n /login número \n /fuckbilly \n /pobre \n /vote @membro [s || n] \n /votekick @membro')
        }
        case 'vava':
            if (!isGroupMsg) break;
            let chepo = '@5513991769173@c.us'
            return await client.sendTextWithMentions(groupId, `${chepo}:\njoga vava?`);
        case 'tnc':
            return await client.sendTextWithMentions(groupId, 'Os seguintes membros tomaram no cu: ' + groupMembers.map(a => '@' + a.replace('@c.us', '') ).join(', ') );
        case 'login':
            try {
                if (!isGroupMsg) return;
                if (args.length === 1 && args[0] === '--help' || args[0] === '-h'){
                    return await client.sendText(groupId, `Pediu ajuda neh?`);
                }
                if (args.length === 1){
                    let actor = sender.id;
                    let randomMinutes = random(24, 260);
                    if (isNaN(arg[0])) throw new ZapError('Wrong format.');
                    if (Number(arg[0]) < 0) throw new ZapError('O cara meteu do loco. Quer voltar no tempo filhão? kkjkjjjjjjj???');

                    return await client.sendTextWithMentions(groupId, `${toMention(from)} irá logar em aproximadamente ${randomMinutes + Number(arg[0])} minutos.`);
                } else {
                    return await client.sendText(groupId, 'Wrong format.');
                }
            } catch (e){
                console.error(color(e, 'red'));
                if (e instanceof ZapError){
                    return await client.reply(from, e.message, id);
                }
                return await client.reply(from, 'bugou algo.', id);
            }
        case 'fuckbilly':{
            if (!isGroupMsg) break;
            let billy = '@5511958795261@c.us'
            return await client.sendTextWithMentions(groupId, `Fuck billy (${billy}) 🖕🖕🖕`)
        }
        case 'pobre': {
            if (!isGroupMsg) break;
            let billy = '@5511958795261@c.us'
            return await client.sendTextWithMentions(groupId, `${billy}:\nvocê é pobre mano kkk`);
        }
        case 'teste': {
            let target = isGroupMsg? from : chat.id;
            return await client.reply(from, `Tá funcionando xd`, id);
        }
        case 'vote': {
            if (!isGroupMsg) return;
            if (!isBotGroupAdmins) return;
            try {
                if (args.length == 0){
                    throw new ZapError('Você precisa especificar em qual votação está votando.');
                } else if (args.length <= 2){
                    let votingMember = args[0];
                    if (!votingMap[votingMember]){
                        throw new ZapError('Não há votações para esse membro.');
                    }
                    let vote = args.length === 2? args[1] : 'y';

                    doVote(votingMap[votingMember], sender.id, getVote(vote));

                    let voting = votingMap[votingMember]

                    if (!voting.done){
                        return await client.sendTextWithMentions(groupId, ([
                            `Atualização: Votekick no membro ${arg[0]}`,
                            `\n`,
                            `ID: ${voting.id}`,
                            `Banir: ${voting.shouldKick}/${voting.votesNeeded}`,
                            `Não banir: ${voting.shouldKeep}/${voting.votesNeeded}`,
                        ]).join('\n')
                        );
                    } else {
                        let shouldKick = voting.kicked;

                        await client.sendTextWithMentions(groupId, ([
                            `Votação encerrada: Votekick no membro ${arg[0]}.`,
                            `\n`,
                            `ID: ${voting.id}`,
                            `${shouldKick?  '✅' : '❌'} - Banir: ${voting.shouldKick}/${voting.votesNeeded}`,
                            `${!shouldKick? '✅' : '❌'} - Não banir: ${voting.shouldKeep}/${voting.votesNeeded}`,
                            ``,
                            `O membro ${shouldKick? 'será' : 'não será'} banido.`
                        ]).join('\n')
                        );
                        if (shouldKick) await client.removeParticipant(groupId, voting.target);
                        delete voting[votingMember];
                    }
                } else {
                    await client.reply(from, 'Votou errado: /vote MEMBRO SEU_VOTO', id);
                }
            } catch (e){
                console.error(color(e, 'red'));
                if (e instanceof ZapError){
                    return await client.reply(from, e.message, id);
                }
                return await client.reply(from, 'bugou algo.', id);
            }
        }
        case 'voteban':
        case 'votekick': {
            if (args.length === 0) throw new Error(`Formato errado... Coloca um @.`)
            if (!isGroupMsg) return;
            if (!isBotGroupAdmins) return await client.reply(from, 'O bot deve ser admin pra poder fazer votekick.', id); 
            try {
                let voting = createVoting(votingMap, args[0], groupMembers, sender.id);

                return await client.sendTextWithMentions(groupId, ([
                    `Votação iniciada, votekick no membro ${args[0]}.`,
                    `\n`,
                    `ID: ${voting.id}`,
                    `Banir: ${voting.shouldKick}/${voting.votesNeeded}`,
                    `Não banir: ${voting.shouldKeep}/${voting.votesNeeded}`,
                ].join('\n'))
                );
            } catch (e) {
                return await client.reply(from, e.message, id);
            }
        }
        case 'teste': {
            let target = isGroupMsg? from : chat.id;
            return await client.reply(from, `Tá funcionando xd`, id);
        }
        default:
            console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.error(color(err, 'red'))
    }
}
