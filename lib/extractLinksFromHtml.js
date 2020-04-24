const extract = (regex, source) => {
    const result = [];

    let match;
    while ((match = regex.exec(source)) !== null) {
        const [, url] = match;
        if (url) {
            result.push(String(url || '').replace(/ /g, '%20'));
        }
    }

    return result;
};

const extractLinksFromHtml = (html, tags) => {
    const aRegex = /<a.+?href\s*=\s*"(.+?)".*?>/gis;
    const imgRegex = /<img.+?src\s*=\s*"(.+?)".*?>/gis;
    const sourceRegex = /<source.+?(srcset|src)\s*=\s*"(.+?)".*?>/gis;
    const iframeRegex = /<iframe.+?src\s*=\s*"(.+?)".*?>/gis;
    const scriptRegex = /<script.+?src\s*=\s*"(.+?)".*?>/gis;
    const linkRegex = /<link.+?href\s*=\s*"(.+?)".*?>/gis;

    let result = [];

    if (tags.a) {
        result = [...result, ...extract(aRegex, html)];
    }

    if (tags.img) {
        result = [...result, ...extract(imgRegex, html)];
    }

    if (tags.source) {
        result = [...result, ...extract(sourceRegex, html)];
    }

    if (tags.iframe) {
        result = [...result, ...extract(iframeRegex, html)];
    }

    if (tags.script) {
        result = [...result, ...extract(scriptRegex, html)];
    }

    if (tags.link) {
        result = [...result, ...extract(linkRegex, html)];
    }

    return result;
};

module.exports = { extractLinksFromHtml };
