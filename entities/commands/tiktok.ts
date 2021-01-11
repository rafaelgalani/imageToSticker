import { decryptMedia } from "@open-wa/wa-automate";
import { ZapCommand } from "./command";
// WILL ALSO BE MOVED LATER.
import { is } from "../../utils";
import { tiktok } from '../../lib/downloader';
import { AdminRule } from "../rules";
import { PostCollector, Result } from "tiktok-scraper";

export class TikTokCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['tiktok', 'ticoteco', 'tecoteco',];
    }

    protected getRules(){
        return [  ];
    }

    protected async runSpecificLogic() {
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        //if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //if (!is.Url(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
        try {
            await client.reply(target, 'Downloading...', id);
        } catch (e) {
            console.log(e);
        }
        let downloadResult: PostCollector & { noWaterMark: boolean, url: string, headers: string} = await tiktok(url);
        const filename = downloadResult.authorMeta.name + '.mp4'
        const caption = `@${downloadResult.authorMeta.name} / ${downloadResult.musicMeta.musicName}`;
                        /*`${downloadResult.playCount.toLocaleString()}`+
                        `${downloadResult.diggCount.toLocaleString()}`+
                        `Comment: ${downloadResult.commentCount.toLocaleString()} `+
                        `Share: ${downloadResult.shareCount.toLocaleString()} `+
                        `Caption: ${downloadResult.text.trim() ? downloadResult.text : '-'}`*/
        await client.sendFileFromUrl(target, downloadResult.url, filename, caption, id, {
            headers: downloadResult.headers,
        }, true);

        /*.then(async (videoMeta) => {
            
            
            
                //.then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                .catch((err) => console.error(err))
        }).catch(() => client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid. [Invalid Link]', id))*/
    }
}