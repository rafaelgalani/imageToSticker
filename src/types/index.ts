import { color, randomInt } from 'src/utils';
import { CountryCode } from "@open-wa/wa-automate"
import { PostCollector } from "tiktok-scraper"

export type TiktokContent = PostCollector & { noWaterMark: boolean, url: string, headers: string }

export type Mention = `@${CountryCode}${number}`

export type Title = 'admin' | 'membro(a) comum';

type Cooldown = {
    seconds: number;
}

export type CooldownOptions = Cooldown & {
    customCooldown?: CustomCooldownOptions;
};

export type CustomCooldownOptions = Cooldown & {
    identifier: string;
};

declare global {
    interface Array<T> {
        random(): T;
    }
}

Array.prototype.random = function () {
    return this[randomInt(0, this.length - 1)];
};