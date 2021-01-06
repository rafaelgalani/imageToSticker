import { decryptMedia } from "@open-wa/wa-automate";
import { ZapCommand } from "./command";
// WILL ALSO BE MOVED LATER.
import { is } from "../../utils";
import { AdminRule } from "../rules";

export class StickerCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sticker', 'stiker',];
    }

    protected getRules(){
        return [  ];
    }

    protected async runSpecificLogic() {
        const { url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        if ((isMedia || isQuotedImage) && args.length === 0) {
            const encryptMedia = isQuotedImage ? quotedMsg : this.context;
            const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
            const mediaData = await decryptMedia(encryptMedia, uaOverride)
            const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
            let stickerTarget = isGroupMsg? groupId : chat.id; // THIS CAN ALSO BE MOVED.
            await client.sendImageAsSticker(stickerTarget, imageBase64);
            await client.reply(stickerTarget, 'Tá aí.', id)
        } else if (args.length === 1) {
            if (!is.Url(url)) { 
                await client.reply(from, 'Link inválido...', id) 
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