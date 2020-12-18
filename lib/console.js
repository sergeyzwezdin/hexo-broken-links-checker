const { magenta, blue } = require('chalk');

const path = require('path');

const { getRawString } = require('./getRawString');
const { extractLinksFromHtml } = require('./extractLinksFromHtml');
const { normalizeUrlHost } = require('./normalizeUrlHost');
const { extractHttpLinks } = require('./extractHttpLinks');
const { checkLink } = require('./checkLink');
const { loadCache, saveCache, isNeedToCheck, updateCache } = require('./cache');

module.exports = (hexo) =>
    async function () {
        const { config, base_dir, log } = hexo;

        if (config.broken_links_checker) {
            const { enable, cache, head, exclude, frontmatter, tags, timeout, useragent, parallel } = config.broken_links_checker;

            if (enable) {
                return hexo.call('generate', {}).then(async function () {
                    const cacheFilePath = path.join(base_dir, cache.path);

                    if (cache.enable) {
                        loadCache(cacheFilePath);
                    }

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
                                                    ...extractLinksFromHtml(content, tags),
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

                    let processed = [];
                    const parallelizm = parallel || 10;
                    const links = Object.keys(externalLinks);

                    for (const linksPortion of Array.from({ length: Math.ceil(links.length / parallelizm) }).map((_, index) =>
                        links.slice(index * parallelizm, (index + 1) * parallelizm)
                    )) {
                        const currentProcessed = await Promise.allSettled(
                            linksPortion.map(
                                (url) =>
                                    new Promise((resolve, reject) => {
                                        if (exclude.indexOf(url) === -1 && isNeedToCheck(url, cache.lifetime)) {
                                            // TODO: Introduce ability to use regex
                                            log.info('Checking URL: %s', magenta(url));
                                            return checkLink(url, head, timeout, useragent)
                                                .then(() => {
                                                    updateCache(url);
                                                    resolve(url);
                                                })
                                                .catch(() => {
                                                    reject(url);
                                                });
                                        } else {
                                            log.debug('URL check skip: %s', magenta(url));
                                            return resolve(url);
                                        }
                                    })
                            )
                        );

                        processed = [...processed, ...currentProcessed];
                    }

                    const brokenLinks = processed.filter(({ status }) => status === 'rejected').map(({ reason }) => reason);

                    if (cache.enable) {
                        saveCache(cacheFilePath);
                    }

                    if (brokenLinks.length > 0) {
                        log.warn('The following links are broken:');
                        for (const link of brokenLinks) {
                            log.warn('   - %s', magenta(link));
                        }

                        throw new Error(`${brokenLinks.length} external link(s) are broken.`);
                    } else {
                        log.info('URL check is done. %s links checked. All links are alive.', magenta(processed.length));
                    }
                });
            } else {
                log.info('Broken links checker %s', blue('disabled'));
            }
        } else {
            log.info('Broken links checker %s', blue('disabled'));
        }
    };
