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

const votingMap = {};

export class ZapError extends Error {
    public constructor(message: string){
        super(message);
        Object.setPrototypeOf(this, ZapError.prototype);
    }
}

export default async (client: Client, message) => {
    try {
        let { type, id, from, fromMe, to, t, sender, isGroupMsg, chat, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
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
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker': {
            // if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            // if (is.Giphy(url)) {
            //     const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
            //     if (!getGiphyCode) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
            //     const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
            //     const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
            //     client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
            //         client.reply(from, 'Here\'s your sticker')
            //         console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
            //     }).catch((err) => console.log(err))
            // } else if (is.MediaGiphy(url)) {
            //     const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
            //     if (!gifUrl) { return client.reply(from, 'Gagal mengambil kode giphy', id) }
            //     const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
            //     client.sendGiphyAsSticker(from, smallGifUrl).then(() => {
            //         client.reply(from, 'Here\'s your sticker')
            //         console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
            //     }).catch((err) => console.log(err))
            // } else {
            //     await client.reply(from, 'maaf, untuk saat ini sticker gif hanya bisa menggunakan link dari giphy.  [Giphy Only]', id)
            // }
            // break
        }
        // Video Downloader
        case 'tiktok':
            // if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            // if (!is.Url(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            // await client.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            // downloader.tiktok(url).then(async (videoMeta) => {
            //     const filename = videoMeta.authorMeta.name + '.mp4'
            //     const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'}`
            //     await client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0', referer: 'https://www.tiktok.com/' } }, true)
            //         .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //         .catch((err) => console.error(err))
            // }).catch(() => client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))
            break
        case 'ig':
        case 'instagram':
            // if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            // if (!is.Url(url) && !url.includes('instagram.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
            // await client.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            // downloader.insta(url).then(async (data) => {
            //     if (data.type == 'GraphSidecar') {
            //         if (data.image.length != 0) {
            //             data.image.map((x) => client.sendFileFromUrl(from, x, 'photo.jpg', '', null, null, true))
            //                 .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //                 .catch((err) => console.error(err))
            //         }
            //         if (data.video.length != 0) {
            //             data.video.map((x) => client.sendFileFromUrl(from, x.videoUrl, 'video.jpg', '', null, null, true))
            //                 .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //                 .catch((err) => console.error(err))
            //         }
            //     } else if (data.type == 'GraphImage') {
            //         client.sendFileFromUrl(from, data.image, 'photo.jpg', '', null, null, true)
            //             .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //             .catch((err) => console.error(err))
            //     } else if (data.type == 'GraphVideo') {
            //         client.sendFileFromUrl(from, data.video.videoUrl, 'video.mp4', '', null, null, true)
            //             .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //             .catch((err) => console.error(err))
            //     }
            // })
            //     .catch((err) => {
            //         console.log(err)
            //         if (err === 'Not a video') { return client.reply(from, 'Error, tidak ada video di link yang kamu kirim. [Invalid Link]', id) }
            //         client.reply(from, 'Error, user private atau link salah [Private or Invalid Link]', id)
            //     })
            break
        case 'twt':
        case 'twitter':
            // if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            // if (!is.Url(url) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            // await client.reply(from, `_Scraping Metadata..._ \n\n${menuId.textDonasi()}`, id)
            // downloader.tweet(url).then(async (data) => {
            //     if (data.type === 'video') {
            //         const content = data.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
            //         const result = await urlShortener(content[0].url)
            //         console.log('Shortlink: ' + result)
            //         await client.sendFileFromUrl(from, content[0].url, 'video.mp4', `Link Download: ${result} \n\nProcessed for ${processTime(t, moment())} _Second_`, null, null, true)
            //             .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //             .catch((err) => console.error(err))
            //     } else if (data.type === 'photo') {
            //         for (let i = 0; i < data.variants.length; i++) {
            //             await client.sendFileFromUrl(from, data.variants[i], data.variants[i].split('/media/')[1], '', null, null, true)
            //                 .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //                 .catch((err) => console.error(err))
            //         }
            //     }
            // })
            //     .catch(() => client.sendText(from, 'Maaf, link tidak valid atau tidak ada media di link yang kamu kirim. [Invalid Link]'))
            break
        case 'fb':
        case 'facebook':
            // if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            // if (!is.Url(url) && !url.includes('facebook.com')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid. [Invalid Link]', id)
            // await client.reply(from, '_Scraping Metadata..._ \n\nTerimakasih telah menggunakan bot ini, kamu dapat membantu pengembangan bot ini dengan menyawer melalui https://saweria.co/donate/yogasakti atau mentrakteer melalui https://trakteer.id/red-emperor \nTerimakasih.', id)
            // downloader.facebook(url).then(async (videoMeta) => {
            //     const title = videoMeta.response.title
            //     const thumbnail = videoMeta.response.thumbnail
            //     const links = videoMeta.response.links
            //     const shorts = []
            //     for (let i = 0; i < links.length; i++) {
            //         const shortener = await urlShortener(links[i].url)
            //         console.log('Shortlink: ' + shortener)
            //         links[i].short = shortener
            //         shorts.push(links[i])
            //     }
            //     const link = shorts.map((x) => `${x.resolution} Quality: ${x.short}`)
            //     const caption = `Text: ${title} \n\nLink Download: \n${link.join('\n')} \n\nProcessed for ${processTime(t, moment())} _Second_`
            //     await client.sendFileFromUrl(from, thumbnail, 'videos.jpg', caption, null, null, true)
            //         .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //         .catch((err) => console.error(err))
            // })
            //     .catch((err) => client.reply(from, `Error, url tidak valid atau tidak memuat video. [Invalid Link or No Video] \n\n${err}`, id))
            break
        // Other Command
        case 'meme':
            // if ((isMedia || isQuotedImage) && args.length >= 2) {
            //     const top = arg.split('|')[0]
            //     const bottom = arg.split('|')[1]
            //     const encryptMedia = isQuotedImage ? quotedMsg : message
            //     const mediaData = await decryptMedia(encryptMedia, uaOverride)
            //     const getUrl = await uploadImages(mediaData, false)
            //     const ImageBase64 = await meme.custom(getUrl, top, bottom)
            //     client.sendFile(chat.id, ImageBase64, 'image.png', '', null, true)
            //         .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
            //         .catch((err) => console.error(err))
            // } else {
            //     await client.reply(from, 'Tidak ada gambar! Untuk membuka cara penggnaan kirim #menu [Wrong Format]', id)
            // }
            break
        // case 'resi':
        //     if (args.length !== 2) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //     const kurirs = ['jne', 'pos', 'tiki', 'wahana', 'jnt', 'rpx', 'sap', 'sicepat', 'pcp', 'jet', 'dse', 'first', 'ninja', 'lion', 'idl', 'rex']
        //     if (!kurirs.includes(args[0])) return client.sendText(from, `Maaf, jenis ekspedisi pengiriman tidak didukung layanan ini hanya mendukung ekspedisi pengiriman ${kurirs.join(', ')} Tolong periksa kembali.`)
        //     console.log('Memeriksa No Resi', args[1], 'dengan ekspedisi', args[0])
        //     cekResi(args[0], args[1]).then((result) => client.sendText(from, result))
        //     break
        // case 'translate':
        //     if (args.length != 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //     if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //     const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
        //     translate(quoteText, args[0])
        //         .then((result) => client.sendText(from, result))
        //         .catch(() => client.sendText(from, '[Error] Kode bahasa salah atau server bermasalah.'))
        //     break
        // case 'ceklok':
        // case 'ceklokasi':
        //     if (!quotedMsg || quotedMsg.type !== 'location') return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //     console.log(`Request Status Zona Penyebaran Covid-19 (${quotedMsg.lat}, ${quotedMsg.lng}).`)
        //     const zoneStatus = await getLocationData(quotedMsg.lat, quotedMsg.lng)
        //     if (zoneStatus.kode !== 200) client.sendText(from, 'Maaf, Terjadi error ketika memeriksa lokasi yang anda kirim.')
        //     let data = ''
        //     for (let i = 0; i < zoneStatus.data.length; i++) {
        //         const { zone, region } = zoneStatus.data[i]
        //         const _zone = zone == 'green' ? 'Hijau* (Aman) \n' : zone == 'yellow' ? 'Kuning* (Waspada) \n' : 'Merah* (Bahaya) \n'
        //         data += `${i + 1}. Kel. *${region}* Berstatus *Zona ${_zone}`
        //     }
        //     const text = `*CEK LOKASI PENYEBARAN COVID-19*\nHasil pemeriksaan dari lokasi yang anda kirim adalah *${zoneStatus.status}* ${zoneStatus.optional}\n\nInformasi lokasi terdampak disekitar anda:\n${data}`
        //     client.sendText(from, text)
        //     break
        // Group Commands (group admin only)
        case 'ban':
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
        case 'vava':
            if (!isGroupMsg) break;
            let chepo = '@5513991769173@c.us'
            return await client.sendTextWithMentions(groupId, `${chepo}:\njoga vava?`);
        case 'tnc':
            return await client.sendTextWithMentions(groupId, 'Os seguintes membros tomaram no cu: ' + groupMembers.map(a => '@' + a.replace('@c.us', '') ).join(', ') );
        case 'login':
            try {
                if (!isGroupMsg) return;

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
