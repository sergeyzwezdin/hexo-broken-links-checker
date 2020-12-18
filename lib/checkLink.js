const fetch = require('node-fetch');

const runQuery = (url, method, timeout, userAgent, resolve, reject) => {
    const headers = {};

    if (userAgent) {
        headers['User-Agent'] = userAgent;
    }

    fetch(url, {
        method,
        timeout,
        headers
    })
        .then(({ status, ok }) => {
            if (ok) {
                resolve(status);
            } else {
                if (method === 'HEAD') {
                    runQuery(url, 'GET', timeout, userAgent, resolve, reject);
                } else {
                    reject(status);
                }
            }
        })
        .catch((err) => {
            if (method === 'HEAD') {
                runQuery(url, 'GET', timeout, userAgent, resolve, reject);
            } else {
                reject(err);
            }
        });
};

const checkLink = async (url, head, timeout, userAgent) =>
    new Promise((resolve, reject) => {
        runQuery(url, head ? 'HEAD' : 'GET', timeout || 0, userAgent, resolve, reject);
    });

module.exports = { checkLink };
