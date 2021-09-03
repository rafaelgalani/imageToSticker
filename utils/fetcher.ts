import axios from 'axios';
import FormData from 'form-data';
import * as fs from 'fs';
import { fromBuffer } from 'file-type';
import resizeImage from './imageProcessing';

/**
 *Fetch Json from Url
 *
 *@param {String} url
 *@param {Object} options
 */
export const fetchJson = async (url, options) => {
    try {
        const result = await axios.get(url, options);
        return JSON.parse(result.data);
    } catch (err){
        console.log(err);
    }
}
 
/**
 * Fetch Text from Url
 *
 * @param {String} url
 * @param {Object} options
 */
 export const fetchText = async (url, options) => {
    try {
        const result = await axios.get(url, options);
        return result.data;
    } catch (err){
        console.log(err);
    }
}

/**
 * Fetch base64 from url
 * @param {String} url
 */
 export const fetchBase64 = async (url, mimetype?) => {
    try {
        const result = await axios.get(url);
        const finalMimetype = mimetype ?? result.headers.get('content-type');

        return `data:${finalMimetype};base64,${Buffer.from(result.data, 'base64')}`;
    } catch (err){
        console.log(err);
    }
}

/**
 * Upload Image to Telegra.ph
 *
 * @param  {String} base64 image buffer
 * @param  {Boolean} resize
 */

export const uploadImages = (buffData, type) /*: Promise<string>*/ => {
    // eslint-disable-next-line no-async-promise-executor
    /*return new Promise(async (resolve, reject) => {
        const { ext } = await fromBuffer(buffData)
        const filePath = 'utils/tmp.' + ext
        const _buffData = type ? await resizeImage(buffData) : buffData
        fs.writeFile(filePath, _buffData, { encoding: 'base64' }, (err) => {
            if (err) return reject(err)
            console.log('Uploading image to telegra.ph server...')
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, 'tmp.' + ext)
            fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) return reject(res.error)
                    resolve('https://telegra.ph' + res[0].src)
                })
                .then(() => fs.unlinkSync(filePath))
                .catch(err => reject(err))
        })
    })*/
}