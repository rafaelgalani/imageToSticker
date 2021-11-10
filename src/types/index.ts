import { color, randomInt } from 'src/utils';
import { ContactId, CountryCode, GroupChatId } from "@open-wa/wa-automate"
import { PostCollector } from "tiktok-scraper"

export type TiktokContent = PostCollector & { noWaterMark: boolean, url: string, headers: string }

export type Alias = string;
export type Mention = `@${CountryCode}${number}`

export type Title = 'admin' | 'membro(a) comum';

type Cooldown = {
    seconds: number;
}

export type CooldownOptions = Cooldown & {
    customCooldown?: CustomCooldownOptions;
    groupCooldown?: boolean;
};

export type CustomCooldownOptions = Cooldown & {
    identifier: string;
};

export type VotingResult = {
    target: Mention,
    shouldKick: number,
    shouldKeep: number,
    done: boolean,
    votes: ContactId[],
    votesNeeded: number,
    kicked?: boolean;
}

export type VoteOption = {
    valid: boolean;
    option?: boolean;
    errorMessage?: string;
}

export type Vote = {
    updatedResult?: VotingResult;
    valid: boolean;
    errorMessage?: string;
}

export type Streak = {
    times: number;
    finished: boolean;
}