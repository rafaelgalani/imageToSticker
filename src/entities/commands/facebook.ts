import { ZapError } from "src/entities/core/error";
import { ArgumentFormat, ArgumentFormatterRule, NArgumentsRule } from "src/entities/rules";
import { ArgsOperator } from "src/entities/rules/group/n-arguments";
import { facebookDownloader } from 'src/lib/downloaders';
// WILL ALSO BE MOVED LATER.
import { isUrl } from "src/utils";
import { ZapCommand } from "./command";

export class FacebookCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['face', 'facebook', 'fb',];
    }

    protected getRules(){
        return [ 
            new NArgumentsRule({
                target: 1,
                operation: ArgsOperator.LTE,
            }),
            new ArgumentFormatterRule([
                new ArgumentFormat(isUrl),
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
                if (targetMessage.type !== 'chat') throw new ZapError('A mensagem deve ser um link do facebook.');
                if (!targetMessage.body.startsWith('https://facebook.com') || !targetMessage.body.startsWith('https://www.facebook.com')) throw new ZapError('O link deve ser do facebook.');

                targetUrl = targetMessage.body;
            }

            let downloadResult: any = await facebookDownloader(targetUrl);

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