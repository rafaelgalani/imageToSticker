require('dotenv').config()
import { Client, Message } from '@open-wa/wa-automate'
import { KickCommand, StickerCommand, ZapContext, ZapError, CodeCommand, DemoteCommand, FuckBillyCommand, LoginCommand, MentionAllCommand, PoorCommand, PromoteCommand, SFCommand, SexCommand, TestCommand, VavaCommand, BocaLeiteCommand, AddMemberCommand, MuteCommand, UnmuteCommand, TikTokCommand, AssCommand, VotekickCommand, ShieldCommand, UepaCommand, PoctCommand, TwitterCommand, InstagramCommand, CalmCommand, FacebookCommand, PrimaCommand } from '../../entities';
import { fullTrim, verifyMute } from '../../utils';

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
            new FacebookCommand(context),
            new InstagramCommand(context),
            new MentionAllCommand(context),
            new PoorCommand(context),
            new PromoteCommand(context),
            new SFCommand(context),
            new SexCommand(context),
            new StickerCommand(context),
            new PrimaCommand(context),
            new TestCommand(context),
            new VavaCommand(context),
            new TwitterCommand(context),
            new VotekickCommand(context),
            new TikTokCommand(context),
            new BocaLeiteCommand(context),
            new AddMemberCommand(context),
            new MuteCommand(context),
            new UnmuteCommand(context),
            new ShieldCommand(context),
            new UepaCommand(context),
            new PoctCommand(context),
            new CalmCommand(context),
        ];

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
