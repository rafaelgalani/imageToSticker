require('dotenv').config()
import { Client, Message } from '@open-wa/wa-automate'
import { KickCommand, StickerCommand, ZapContext, ZapError, CodeCommand, DemoteCommand, FuckBillyCommand, LoginCommand, MentionAllCommand, PoorCommand, PromoteCommand, SFCommand, SexCommand, TestCommand, VavaCommand, AssCommand } from '../../entities';
import { TikTokCommand } from '../../entities/commands/tiktok';

export default async (client: Client, message: Message) => {
    let context = await ZapContext.getContext(client, message);
    try {

        let commands = [
            new AssCommand(context),
            new CodeCommand(context),
            new DemoteCommand(context),
            new FuckBillyCommand(context),
            new KickCommand(context),
            new LoginCommand(context),
            new MentionAllCommand(context),
            new PoorCommand(context),
            new PromoteCommand(context),
            new SFCommand(context),
            new SexCommand(context),
            new StickerCommand(context),
            new TestCommand(context),
            new VavaCommand(context),
            new TikTokCommand(context),
        ];

        for (let command of commands){
            await command.run();
        }

    } catch (err) {
        if (err instanceof ZapError){
            return await client.reply(context.target, err.message, message.id);
        }
    }
}
