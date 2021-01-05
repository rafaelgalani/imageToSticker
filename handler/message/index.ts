require('dotenv').config()
import { Client, Message } from '@open-wa/wa-automate'
import { KickCommand, StickerCommand, ZapContext, ZapError } from '../../entities';

export default async (client: Client, message: Message) => {
    try {
        let context = await ZapContext.getContext(client, message);

        let commands = [
            new StickerCommand(context) ,
            new KickCommand(context) ,
        ];

        for (let command of commands){
            await command.run();
        }

    } catch (err) {
        if (err instanceof ZapError){
            return await client.reply(message.from, err.message, message.id);
        }
    }
}
