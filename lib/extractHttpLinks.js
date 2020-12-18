const extractHttpLinks = (source) => {
    const linksRegex = /(https?):\/\/[a-z0-9\-\(\)=_\?=\\\/%\.]+/gis;

    const result = [];

    let match;
    while ((match = linksRegex.exec(source)) !== null) {
        const [url] = match;
        if (url) {
            result.push(url);
        }
    }

    return result;
};

module.exports = { extractHttpLinks };
