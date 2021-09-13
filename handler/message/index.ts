require('dotenv').config();

import { Client, Message } from '@open-wa/wa-automate'
import * as allCommands from '../../entities/commands';
import { ZapContext, ZapError } from '../../entities';
import { fullTrim, verifyMute } from '../../utils';
import { ZapCommand } from '../../entities/commands/command';

export default async (client: Client, message: Message) => {
    let context = await ZapContext.getContext(client, message);
    try {
        
        let commands: ZapCommand[] = Object.keys(allCommands).map(a => new allCommands[a](context));
        
        for (let command of commands){
            const mute = verifyMute(context.author || context.from);
            if (mute) return;
            await command.run();
        }

    } catch (err) {
        if (err instanceof ZapError){
            return await client.sendReplyWithMentions(context.target, fullTrim(err.message), message.id);
        }
    }
}
