import { decryptMedia } from "@open-wa/wa-automate";
// WILL ALSO BE MOVED LATER.
import { isUrl, resizeImage } from "../../utils";
import { ZapCommand } from "./command";

export class StickerCommand extends ZapCommand {
    
    protected getPatterns(){
        return ['sticker', 'stiker',];
    }

    private shouldRemoveBg(){
        const args = this.context.args;
        return args.length && args[0] === 'remove'
    }

    private async getImage(){
        const shouldRemoveBg = this.shouldRemoveBg();
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, message, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        const mediaData = await decryptMedia(isQuotedImage? quotedMsg : message, uaOverride)
        const imageResizedData = await resizeImage(mediaData, shouldRemoveBg);

        return imageResizedData;
    }

    protected async runSpecificLogic() {
        const { target, url, from, isMedia, isQuotedImage, isGroupMsg, groupId, id, chat, args, quotedMsg, mimetype, uaOverride, client } = this.context; // Not to good. Need to review it later... 
        
        // if is a quoted image
        if (isQuotedImage || isMedia) {
            let stickerTarget = isGroupMsg? groupId : chat.id; // THIS CAN ALSO BE MOVED.
            await client.sendImageAsSticker(stickerTarget, await this.getImage());
        } 
    }
}