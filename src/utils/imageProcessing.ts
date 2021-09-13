import * as sharp from 'sharp';
import { removeBackgroundFromImageBase64 } from "remove.bg";

const removeBg = async (base64img: string): Promise<string | null> => {
    try {
        const result = await removeBackgroundFromImageBase64({
            base64img,
            apiKey: process.env.REMOVE_BG_API_KEY,
            size: "regular",
            crop: true,
        });
        
        return result.base64img;
    } catch (e) {
        console.log("Error when removing background: " + JSON.stringify(e));
        return null;
    }
}

const resizeImage = async (buff: Buffer, shouldRemoveBg = false) : Promise<string> => {
    console.log('Resizing image...')
    try {
        let finalBuffer: Buffer;
        if (shouldRemoveBg) {
            const bufferWithoutBackground = await removeBg(buff.toString('base64'));
            finalBuffer = Buffer.from(bufferWithoutBackground, 'base64');
        } else {
            finalBuffer = buff;
        }
        
        const resizedImageBuffer = await sharp(finalBuffer, { 
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
        
        const resizedImageData = resizedImageBuffer.toString('base64')
        const resizedBase64 = `data:image/png;base64,${resizedImageData}`
        
        return resizedBase64;
    } catch (e) {
        throw e;
    }
};

export default async (buff: Buffer, removeBg?: boolean) : Promise<string> => {
    return await resizeImage(buff, removeBg);
};