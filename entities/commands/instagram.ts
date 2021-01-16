import { decryptMedia } from "@open-wa/wa-automate";
import { ZapCommand } from "./command";
// WILL ALSO BE MOVED LATER.
import { is } from "../../utils";
import { insta, tiktok, twitter } from '../../lib/downloader';
import { AdminRule, ArgumentFormat, ArgumentFormatterRule, NArgumentsRule } from "../rules";
import { PostCollector, Result } from "tiktok-scraper";
import { downloader, urlShortener } from "../../lib";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapError } from "../core/error";

export class InstagramCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['insta', 'instagram', 'ig',];
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

        await client.reply(target, 'Pera...', id);

        try {

            let targetUrl;
            
            if (args.length === 1){
                targetUrl = url;
            } else {
                const targetMessage = quotedMsg;
                if (targetMessage.type !== 'chat') throw new ZapError('A mensagem deve ser um link do instagram.');
                if (!targetMessage.body.startsWith('https://instagram.com') || !targetMessage.body.startsWith('https://www.instagram.com')) throw new ZapError('O link deve ser do instagram.');

                targetUrl = targetMessage.body;
            }

            let downloadResult: any = await insta(targetUrl);

            const { type, image, video } = downloadResult;

            if (type == 'GraphSidecar') {
                if (image.length != 0) {
                    for (let img of image){
                        await client.sendFileFromUrl(target, img, 'photo.jpg', '', id, null, true);
                    }
                }
                if (video.length != 0) {
                    for (let vid of video){
                        await client.sendFileFromUrl(target, vid, 'video.mp4', '', id, null, true);
                    }
                }
            } else if (type == 'GraphImage') {
                await client.sendFileFromUrl(target, image, 'video.mp4', '', id, null, true);
            } else if (type == 'GraphVideo') {
                await client.sendFileFromUrl(target, video.videoUrl, 'video.mp4', '', id, null, true);
            }
        } catch (e) {
            await client.reply(target, 'Deu ruim.', id);
            console.error(e);
        }
    }
}