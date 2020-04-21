const getRawString = (value) => {
    if (value) {
        if (typeof value === 'string') {
            return [value];
        } else if (Array.isArray(value)) {
            return value.map((item) => getRawString(item)).flat(Infinity);
        } else if (typeof value === 'object') {
            return Object.getOwnPropertyNames(value)
                .map((item) => getRawString(value[item]))
                .flat(Infinity);
        }
    }

    return [];
};

module.exports = { getRawString };
