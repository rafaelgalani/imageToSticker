import { TiktokContent } from "../types"

const { getVideoMeta } = require('tiktok-scraper')
const { fetchJson } = require('../utils/fetcher')
const { promisify } = require('util')
const { instagram, twitter: tt } = require('video-url-link')

const igGetInfo = promisify(instagram.getInfo)
const twtGetInfo = promisify(tt.getInfo)

/**
 * Tries to get Tiktok content.
 */
export const tiktokDownloader = async (url: string): Promise<TiktokContent> => {
    console.log('Get metadata from =>', url)
    const response = await getVideoMeta(url, { noWaterMark: true, hdVideo: true })
    
    let result = response.collector?.[0];
    
    result.url = result.videoUrl;
    result.headers = response.headers;
    result.noWaterMark = false;

    return result;
}

/**
 * Tries to get Instagram content.
 */
export const instaDownloader = async (url: string) => {
    return await igGetInfo(url.replace(/\?.*$/g, ''), {})
}

/**
 * Tries to get Twitter content.
 */
export const twitterDownloader = async (url: string) => {
    return await twtGetInfo(url, {})
}

/**
 * Tries to get Facebook content.
 */
export const facebookDownloader = async (url: string) => {
    const apikey = '3tgDBIOPAPl62b0zuaWNYog2wvRrc4V414AjMi5zdHbU4a'
    const result = await fetchJson('http://keepsaveit.com/api/?api_key=' + apikey + '&url=' + url, { method: 'GET' })
        
    const key = result.code
    switch (key) {
    case 212:
        throw new Error('Access block for you, You have reached maximum 5 limit per minute hits, please stop extra hits.');
    case 101:
        throw new Error('API Key error : Your access key is wrong');
    case 102:
        throw new Error('Your Account is not activated.');
    case 103:
        throw new Error('Your account is suspend for some resons.');
    case 104:
        throw new Error('API Key error : You have not set your api_key in parameters.');
    case 111:
        throw new Error('Full access is not allow with DEMO API key.');
    case 112:
        throw new Error('Sorry, Something wrong, or an invalid link. Please try again or check your url.');
    case 113:
        throw new Error('Sorry this website is not supported.');
    case 404:
        throw new Error('The link you followed may be broken, or the page may have been removed.');
    case 405:
        throw new Error('You can\'t download media in private profile. Looks like the video you want to download is private and it is not accessible from our server.');
    default:
        return result
    }       
}