var crypto = require('crypto');

var generateKey = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString() + new Date());
    return sha.digest('hex');
};

var createSaltHash = function(content, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(content + salt);
    return hash.digest('hex');
};

var checkHash = function(content, hash) {
    var contentHashed = createSaltHash(content, process.env.secretKey);
    return contentHashed === hash;
};

module.exports = {
    generateKey: generateKey,
    createSaltHash: createSaltHash,
    checkHash: checkHash
};