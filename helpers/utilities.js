const crypto = require('crypto');
const environment = require('./environments');

const utilities = {};

// Parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// Hash the string
utilities.hash = (stringData) => {
    if (typeof stringData === 'string' && stringData.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(stringData)
            .digest('hex');
        return hash;
    }
    return false;
};

module.exports = utilities;
