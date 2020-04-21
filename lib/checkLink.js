const fetch = require('node-fetch');

const runQuery = (url, method, timeout, resolve, reject) => {
    fetch(url, { method, timeout })
        .then(({ status, ok }) => {
            if (ok) {
                resolve(status);
            } else {
                if (method === 'HEAD') {
                    runQuery(url, 'GET', timeout, resolve, reject);
                } else {
                    reject(status);
                }
            }
        })
        .catch((err) => {
            if (method === 'HEAD') {
                runQuery(url, 'GET', timeout, resolve, reject);
            } else {
                reject(err);
            }
        });
};

const checkLink = async (url, head, timeout) =>
    new Promise((resolve, reject) => {
        runQuery(url, head ? 'HEAD' : 'GET', timeout || 0, resolve, reject);
    });

module.exports = { checkLink };
