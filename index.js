hexo.config.broken_links_checker = Object.assign(
    {
        enable: true,
        head: true,
        frontmatter: [],
        exclude: [],
        tags: {
            a: true,
            img: true,
            source: true,
            iframe: true,
            script: true,
            link: true
        },
        timeout: 0,
        useragent: null,
        parallel: 10,
        cache: {
            enable: true,
            lifetime: 1440,
            path: 'link-checker.json'
        }
    },
    hexo.config.broken_links_checker
);

hexo.extend.console.register('check-links', 'Check broken links', {}, require('./lib/console')(hexo));
