const { magenta, blue, red } = require('chalk');

const { getRawString } = require('./getRawString');
const { extractLinksFromHtml } = require('./extractLinksFromHtml');
const { normalizeUrlHost } = require('./normalizeUrlHost');
const { extractHttpLinks } = require('./extractHttpLinks');
const { checkLink } = require('./checkLink');

module.exports = (hexo) =>
    async function () {
        const { config, log } = hexo;

        if (config.broken_links_checker) {
            const { enable, head, exclude, frontmatter, timeout } = config.broken_links_checker;

            if (enable) {
                return hexo.call('generate', {}).then(async function () {
                    log.info('Scanning for the links');

                    const posts = hexo.locals
                        .get('posts')
                        .data.map(({ content, path, ...post }) => {
                            return {
                                path,
                                externalLinks: [
                                    ...new Set(
                                        [
                                            ...new Set(
                                                [
                                                    ...extractLinksFromHtml(content),
                                                    ...(frontmatter || [])
                                                        .map((item) => post[item])
                                                        .filter((item) => Boolean(item))
                                                        .map(getRawString)
                                                ].flat(Infinity)
                                            )
                                        ]
                                            .map(extractHttpLinks)
                                            .flat(Infinity)
                                            .map((url) => normalizeUrlHost(String(url || '')))
                                    )
                                ]
                            };
                        })
                        .filter(({ externalLinks }) => externalLinks.length > 0);

                    const externalLinks = posts.reduce((result, current) => {
                        for (const url of current.externalLinks) {
                            if (result[url]) {
                                result[url].push(current.path);
                            } else {
                                result[url] = [current.path];
                            }

                            result[url] = [...new Set(result[url])];
                        }

                        return result;
                    }, {});

                    log.info('Found %s external links', magenta(Object.keys(externalLinks).length));

                    const brokenLinks = [];

                    for (const url of Object.keys(externalLinks)) {
                        try {
                            if (exclude.indexOf(url) === -1) {
                                log.info('Checking URL: %s', magenta(url));
                                await checkLink(url, head, timeout);
                            } else {
                                log.info('URL check skip: %s', magenta(url));
                            }
                        } catch {
                            log.error(
                                'URL check failed: %s\n      Check the following pages:\n%s',
                                magenta(url),
                                red(externalLinks[url].map((path) => `        - ${path}`).join('\n'))
                            );
                            brokenLinks.push(url);
                        }
                    }

                    if (brokenLinks.length > 0) {
                        throw new Error(`${brokenLinks.length} external link(s) are broken.`);
                    } else {
                        log.info('URL check is done. All links are alive.');
                    }
                });
            } else {
                log.info('Broken links checker %s', blue('disabled'));
            }
        } else {
            log.info('Broken links checker %s', blue('disabled'));
        }
    };
