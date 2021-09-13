const { fetchBase64 } = require('../utils/fetcher')

const parseMemeCaption = (caption: string) => caption.trim().replace(/\s/g, '_').replace(/\?/g, '~q').replace(/\%/g, '~p').replace(/\#/g, '~h').replace(/\//g, '~s')

export default async (imageUrl: string, top: string, bottom: string) => {
    const [ topText, bottomText ] = [ parseMemeCaption(top), parseMemeCaption(bottom) ];
    return await fetchBase64(`https://api.memegen.link/images/custom/${topText}/${bottomText}.png?background=${imageUrl}`, 'image/png');
}