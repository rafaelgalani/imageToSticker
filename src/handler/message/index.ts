require('dotenv').config();

import { Client, Message } from '@open-wa/wa-automate'
import * as allCommands from '../../entities/commands';
import { ZapContext, ZapError } from '../../entities';
import { fullTrim, verifyMute } from '../../utils';
import { ZapCommand } from '../../entities/commands/command';

export default async (client: Client, message: Message) => {
    let context = await ZapContext.getContext(client, message);
    if (!context.command) return;
    try {
        
        let commands: ZapCommand[] = Object.keys(allCommands).map(a => new allCommands[a](context, allCommands[a].cooldownOptions));
        
        for (let command of commands){
            const mute = verifyMute(context.author || context.from);
            if (mute) return;

            const result = await command.run();
            console.log(
                'Command result: ', result
            );
        }

    } catch (err) {
        if (err instanceof ZapError){
            return await client.sendReplyWithMentions(context.target, fullTrim(err.message), message.id);
        }
    }
}
