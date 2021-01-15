import { decryptMedia } from "@open-wa/wa-automate";
import { ZapCommand } from "./command";
// WILL ALSO BE MOVED LATER.
import { is } from "../../utils";
import { tiktok, twitter } from '../../lib/downloader';
import { AdminRule, ArgumentFormat, ArgumentFormatterRule, NArgumentsRule } from "../rules";
import { PostCollector, Result } from "tiktok-scraper";
import { downloader, urlShortener } from "../../lib";
import { ArgsOperator } from "../rules/group/n-arguments";

export class TwitterCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['twitter', 'tt', 'tweet', 'tw', 'tweet',];
    }

    protected getRules(){
        return [ 
            new NArgumentsRule({
                target: 1,
                operation: ArgsOperator.EQ,
            }),
            new ArgumentFormatterRule([
                new ArgumentFormat(is.Url),
            ])
        ];
    }

    protected async runSpecificLogic() {
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 

        await client.reply(target, 'Pera...', id);

        try {
            let downloadResult: any = await twitter(url);

            const { type, variants } = downloadResult;

            if (type === 'video'){
                const content = variants.filter(x => x.content_type !== 'application/x-mpegURL')
                                        .sort((a, b) => b.bitrate - a.bitrate)[0]

                await client.sendFileFromUrl(
                    target, 
                    content.url, 
                    'video.mp4', 
                    ``, 
                    id, 
                    null, 
                    true
                );
            }
        } catch (e) {
            await client.reply(target, 'Deu ruim.', id);
            console.error(e);
        }



        // tweet(url).then(async (data) => {
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
        /*.then(async (videoMeta) => {
            
            
            
                //.then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                .catch((err) => console.error(err))
        }).catch(() => client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))*/
    }
}