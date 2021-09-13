import { twitterDownloader } from '../../lib/downloaders';
// WILL ALSO BE MOVED LATER.
import { is } from "../../utils";
import { ZapError } from "../core";
import { ArgumentFormat, ArgumentFormatterRule, NArgumentsRule } from "../rules";
import { ArgsOperator } from "../rules/group/n-arguments";
import { ZapCommand } from "./command";

export class TwitterCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['twitter', 'tt', 'tweet', 'tw', 'tweet',];
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

        let targetUrl;

        try {
            if (args.length === 1){
                targetUrl = url;
            } else {
                const targetMessage = quotedMsg;
                if (targetMessage.type !== 'chat') throw new ZapError('A mensagem deve ser um link do twitter.');
                if (!targetMessage.body.startsWith('https://twitter.com') || !targetMessage.body.startsWith('https://www.twitter.com')) throw new ZapError('O link deve ser do twitter.');

                targetUrl = targetMessage.body;
            }

            let downloadResult: any = await twitterDownloader(targetUrl);

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
    }
}