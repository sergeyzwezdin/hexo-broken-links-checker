# hexo-broken-links-checker ![Publish on NPM](https://github.com/sergeyzwezdin/hexo-broken-links-checker/workflows/Publish%20on%20NPM/badge.svg) ![](https://img.shields.io/npm/v/hexo-broken-links-checker)

`hexo-broken-links-checker` is a plugin for Hexo static site generator that checks broken links.

-   Scans **all links** in the post's content and **frontmatter** part.
-   Able to use either HTTP **HEAD** or **GET** methods. It can use the HTTP HEAD method to speed up the link checking. If it fails, it will double-check with HTTP GET request.
-   No more broken links on your website. Be sure that all links on your website are up to date.

## How it works

1. Once the plugin installed, new `check-links` console command appears.
2. Running `npx hexo check-links` the plugin will scan all posts (and their frontmatter, if it is configured) and extract all links to external resources (`http://` and `https://` only).
3. Finally, the plugin checks all links one by one via HTTP GET/HEAD method. If any links are broken (HTTP status code is other than `2xx`), the console error will appear 👌.

## Requirements

-   Hexo: 5.x
-   Node 12+

## Usage

1. Install the plugin using npm:

```bash
$ npm install hexo-broken-links-checker --save-dev
```

2. Run the plugin:

```bash
$ npx hexo check-links
```

3. Drink some tea ☕️ while the plugin checking the links.
4. See if there are any broken links on the website.

It's useful to integrate the command running into CI workflow.

## Configuration

To configure the plugin add `broken_links_checker` key to the Hexo config file. For example:

```yaml
broken_links_checker:
    enable: true
    head: true
    frontmatter:
        - links
    exclude:
        - https://website1.com/page1.html
        - https://website2.com/page2.html
    timeout: 1000
    useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    parallel: 10
    tags:
        a: true
        img: true
        source: true
        iframe: true
        script: true
        link: true
    cache:
        enable: true
        lifetime: 1440
        path: 'link-checker.json'
```

| Key              | Required | Default value       | Description                                                                                                                                                                                                        |
| ---------------- | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enable`         | `false`  | `true`              | Enable/disable broken links checking.                                                                                                                                                                              |
| `head`           | `false`  | `true`              | If set, the plugin will use HTTP HEAD method to check the link. If checking fails, it will fall back to HTTP GET method before reporting that URL is broken. Using HTTP HEAD method usually speed up the checking. |
| `frontmatter`    | `false`  | empty               | Keys in frontmatter that should be scanned in addition to post content.                                                                                                                                            |
| `exclude`        | `false`  | empty               | Array of URLs that should be ignored for some reason.                                                                                                                                                              |
| `timeout`        | `false`  | `0`                 | Timeout in milliseconds for URL checking. Use `0` if you don't want to use any timeout.                                                                                                                            |
| `useragent`      | `false`  | `null`              | User-Agent header while checking the link.                                                                                                                                                                         |
| `parallel`       | `false`  | `10`                | Number of checks that could be run in parallel.                                                                                                                                                                    |
| `tags`           | `false`  | `true` to all       | Tags that should be processed on the page (e.g. `<a>`, `<img>`, etc).                                                                                                                                              |
| `cache.enable`   | `false`  | `true`              | Enable/disable caching results of the checking. If enabled the results of the checking will be stored in the file. The URL checking will be skipped if it was checked already and is not expired.                  |
| `cache.lifetime` | `false`  | `1440`              | Time in minutes to expire the URL checking result.                                                                                                                                                                 |
| `cache.path`     | `false`  | `link-checker.json` | Name of the file where checking results will be stored.                                                                                                                                                            |
