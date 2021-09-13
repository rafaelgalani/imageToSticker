const { fetchText } = require('../utils/fetcher')

export default async (url: string) => fetchText(`https://tinyurl.com/api-create.php?url=${url}`)