import { ZapError } from "entities/core/error";
import { ArgumentFormat, ArgumentFormatterRule, NArgumentsRule } from "entities/rules";
import { ArgsOperator } from "entities/rules/group/n-arguments";
import { tiktokDownloader } from 'lib/downloaders';
import { PostCollector } from "tiktok-scraper";
// WILL ALSO BE MOVED LATER.
import { is } from "utils";
import { ZapCommand } from "./command";

export class TikTokCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['tiktok', 'ticoteco', 'tecoteco',];
    }

    protected getRules(){
        return [ 
            new NArgumentsRule({
                target: 1,
                operation: ArgsOperator.LTE,
            }),
            new ArgumentFormatterRule([
                new ArgumentFormat(is.Url),
            ])
        ];
    }

    protected async runSpecificLogic() {
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        //if (args.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
        //if (!is.Url(url) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid. [Invalid Link]', id)
        let targetUrl;
        if (args.length === 1){
            targetUrl = url;
        } else {
            const targetMessage = quotedMsg;
            if (targetMessage.type !== 'chat') throw new ZapError('A mensagem deve ser um link do tiktok.');
            if (!targetMessage.body.startsWith('https://tiktok.com') || 
                !targetMessage.body.startsWith('https://www.tiktok.com') || 
                !targetMessage.body.startsWith('https://vm.tiktok.com')
            ) throw new ZapError('O link deve ser do tiktok.');

            targetUrl = targetMessage.body;
        }
        
        try {
            await client.reply(target, 'Downloading...', id);
        } catch (e) {
            console.log(e);
        }
        let downloadResult: PostCollector & { noWaterMark: boolean, url: string, headers: string} = await tiktokDownloader(targetUrl);
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
    }
}