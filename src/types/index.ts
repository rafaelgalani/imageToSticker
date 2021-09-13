import { PostCollector } from "tiktok-scraper"

export type TiktokContent = PostCollector & { noWaterMark: boolean, url: string, headers: string }