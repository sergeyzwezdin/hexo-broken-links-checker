const normalizeUrlHost = (source) => {
    const address = new URL(source);
    address.protocol = address.protocol.toLowerCase();
    address.host = address.host.toLowerCase();
    return address
        .toString()
        .trim()
        .replace(/[\\\/]+$/, '');
};

module.exports = { normalizeUrlHost };
