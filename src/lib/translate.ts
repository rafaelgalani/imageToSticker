import translate from 'google-translate-open-api';

export default async (text: string, lang: string) => {
    const result = await translate(text, { tld: 'com', to: lang });
    return result.data[0];
}
