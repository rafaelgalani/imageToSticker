require('dotenv').config()
import { Client, Message } from '@open-wa/wa-automate'
import { KickCommand, StickerCommand, ZapContext, ZapError, CodeCommand, DemoteCommand, FuckBillyCommand, LoginCommand, MentionAllCommand, PoorCommand, PromoteCommand, SFCommand, SexCommand, TestCommand, VavaCommand, BocaLeiteCommand, AddMemberCommand, MuteCommand, UnmuteCommand, TikTokCommand, AssCommand } from '../../entities';
import { verifyMute } from '../../utils';

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
            new BocaLeiteCommand(context),
            new AddMemberCommand(context),
            new MuteCommand(context),
            new UnmuteCommand(context),
        ];

        for (let command of commands){
            const mute = verifyMute(context.author || context.from);
            if (mute) return;
            await command.run();
        }

    } catch (err) {
        if (err instanceof ZapError){
            return await client.reply(context.target, err.message, message.id);
        }
    }
}
