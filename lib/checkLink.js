const fetch = require('node-fetch');

const checkLink = async (url, timeout) => {
    return new Promise((resolve, reject) => {
        fetch(url, { timeout: timeout || 0 })
            .then(({ status, ok }) => {
                if (ok) {
                    resolve(status);
                } else {
                    reject(status);
                }
            })
            .catch((err) => reject(err));
    });
};

module.exports = { checkLink };
