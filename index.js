hexo.config.broken_links_checker = Object.assign(
    {
        enable: true,
        head: true,
        frontmatter: [],
        exclude: [],
        timeout: 0
    },
    hexo.config.broken_links_checker
);

hexo.extend.console.register('check-links', 'Check broken links', {}, require('./lib/console')(hexo));
