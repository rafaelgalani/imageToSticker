import { decryptMedia } from "@open-wa/wa-automate";
// WILL ALSO BE MOVED LATER.
import { is, resizeImage } from "../../utils";
import { ZapCommand } from "./command";

export class StickerCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sticker', 'stiker',];
    }

    protected async runSpecificLogic() {
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        if ((isMedia || isQuotedImage) && args.length <= 1) {
            const [ removeBg ] = args;

            const shouldRemoveBg = removeBg? removeBg.toLowerCase() === 'remove' : false;
            if (!isQuotedImage) return;

            const mediaData = await decryptMedia(quotedMsg, uaOverride)
            const imageResizedData = await resizeImage(mediaData, shouldRemoveBg);
            
            let stickerTarget = isGroupMsg? groupId : chat.id; // THIS CAN ALSO BE MOVED.
            await client.sendImageAsSticker(stickerTarget, imageResizedData);

        } else if (args.length === 1) {
            const [ arg ] = args;

            if (!is.Url(arg)) { 
                await client.reply(from, 'Link inválido...', id);
            } else if (arg.toLowerCase() === 'remove') {
                if (!isQuotedImage) return;
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageResizedData = await resizeImage(mediaData, true);
                
                let stickerTarget = isGroupMsg? groupId : chat.id; // THIS CAN ALSO BE MOVED.
                await client.sendImageAsSticker(stickerTarget, imageResizedData);
            }
            const result = await client.sendStickerfromUrl(from, url);
            
            if (!result && result !== undefined){
                return await client.sendText(from, 'Imagem inválida.');
            }

            await client.reply(from, 'Tá aí.', id);
        } else {
            await client.reply(from, 'Comando no formato errado.', id)
        }
    }
}