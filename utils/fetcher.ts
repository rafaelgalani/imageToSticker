import axios, { AxiosRequestConfig } from 'axios';

/**
 * Fetches a JSON object from the given url.
 */
export const fetchJson = async (url: string, options?: AxiosRequestConfig): Promise<object> => {
    try {
        const result = await axios.get(url, options);
        return JSON.parse(result.data);
    } catch (err){
        console.log('Error when fetching JSON from URL: ', JSON.stringify(err));
    }
}
 
/**
 * Fetches text from the given url.
 */
 export const fetchText = async (url: string, options: AxiosRequestConfig): Promise<string> => {
    try {
        const result = await axios.get(url, options);
        return result.data;
    } catch (err){
        console.log('Error when fetching text from URL: ', JSON.stringify(err));
    }
}

/**
 * Fetches a base64 from the given url.
 */
 export const fetchBase64 = async (url: string, mimetype?: string) => {
    try {
        const result = await axios.get(url);
        const finalMimetype = mimetype ?? result.headers.get('content-type');

        return `data:${finalMimetype};base64,${Buffer.from(result.data, 'base64')}`;
    } catch (err){
        console.log('Error when fetching base64 content from URL: ', JSON.stringify(err));
    }
}