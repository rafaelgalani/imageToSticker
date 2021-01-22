import * as sharp from 'sharp';
const { fromBuffer } = require('file-type')

// eslint-disable-next-line no-async-promise-executor
const resizeImage = async (buff, encode) => {
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
        return resizedBase64
    } catch (e) {
        throw e;
    }
};

export default async(buff) : Promise<string> => {
    const result = await resizeImage(buff, true);
    if (typeof result === 'string'){
        return result;
    }
};
