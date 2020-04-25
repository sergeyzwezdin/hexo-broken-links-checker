const fs = require('fs');
const path = require('path');
const parseISO = require('date-fns/parseISO');
const formatISO = require('date-fns/formatISO');
const add = require('date-fns/add');
const isBefore = require('date-fns/isBefore');

let links = {};

function loadCache(path) {
    if (fs.existsSync(path)) {
        links = JSON.parse(fs.readFileSync(path, 'utf-8'));
    }
}

function saveCache(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, {
            recursive: true
        });
    }

    fs.writeFileSync(filePath, JSON.stringify(links, null, 4), 'utf-8');
}

function isNeedToCheck(url, lifetime) {
    const item = links[url];
    if (item) {
        try {
            const date = parseISO(item);
            return isBefore(add(date, { minutes: lifetime }), new Date());
        } catch {
            // re-check the link on date parse error
            return true;
        }
    }
    return true;
}

function updateCache(url) {
    links[url] = formatISO(new Date());
}

module.exports = { loadCache, saveCache, isNeedToCheck, updateCache };
