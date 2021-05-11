import * as sharp from 'sharp';
const { fromBuffer } = require('file-type')

// eslint-disable-next-line no-async-promise-executor
const resizeImage = async (buff, encode, shouldRemoveBg) => {
    console.log('Resizing image...')
    try {
        const { mime } = await fromBuffer(buff)
        const resizedImageBuffer = await sharp(buff, { 
            failOnError: false,
        }).resize({
            width: 512,
            height: 512,
            fit: sharp.fit.contain, 
            background: {
                alpha: 0,
                r: 0, 
                g: 0, 
                b: 0
            }
        }).png().toBuffer();
        
        if (!encode) return resizedImageBuffer;
        const resizedImageData = resizedImageBuffer.toString('base64')
        const resizedBase64 = `data:image/png;base64,${resizedImageData}`

        return shouldRemoveBg? removeBg(resizedBase64) : resizedBase64;
    } catch (e) {
        throw e;
    }
};

export default async(buff, removeBg = false) : Promise<string> => {
    const result = await resizeImage(buff, true, removeBg);
    if (typeof result === 'string'){
        return result;
    }
};

import { RemoveBgError, removeBackgroundFromImageBase64 } from "remove.bg";

export async function removeBg(base64img) {
  try {
    const result = await removeBackgroundFromImageBase64({
      base64img,
      apiKey: process.env.REMOVE_BG_API_KEY,
      size: "regular",
    });

    return result.base64img;
  } catch (e) {
    const errors: Array<RemoveBgError> = e;
    console.log("Error: " + JSON.stringify(errors));
  }
  return null;
}