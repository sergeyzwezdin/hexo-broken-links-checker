const extractLinksFromHtml = (html) => {
    const linksRegex = /<a.+?href\s*=\s*"(.+?)".*?>/gis;

    const result = [];

    let match;
    while ((match = linksRegex.exec(html)) !== null) {
        const [, url] = match;
        if (url) {
            result.push(String(url || '').replace(/ /g, '%20'));
        }
    }

    return result;
};

module.exports = { extractLinksFromHtml };
