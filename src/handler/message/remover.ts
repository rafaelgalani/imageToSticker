import { ContactId } from "@open-wa/wa-automate";
import { ZapContext } from "src/entities";
import { loadJSON } from "src/utils";

export default async ( context: ZapContext ): Promise<boolean> => {
    const { client, message, groupId } = context;

    if ( ! message.isGroupMsg ) {
        return false;
    }

    const members = loadJSON< Array<ContactId> >(`purged-members-group-${ groupId }`) ?? [];

    if ( members.includes(message.sender.id) ) {
        await client.deleteMessage(message.chatId, message.id, false);
        return true;
    }

    if ( message.quotedMsg ) {
        if ( members.includes( message.quotedMsg.sender.id ) ) {
            await client.deleteMessage(message.chatId, message.id, false);
            return true;
        }
    }

    return false;
}