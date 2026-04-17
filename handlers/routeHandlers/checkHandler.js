/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
const lib = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const { parseJSON, generateRandomString } = require('../../helpers/utilities');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(400, {
            error: 'There is a problem in your request!',
        });
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.length === 11 ? requestProperties.body.phone : false;

    const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) >= 0
        ? requestProperties.body.protocol : false;

    const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.length > 0 ? requestProperties.body.url : false;

    const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method.toUpperCase()) >= 0 ? requestProperties.body.method.toUpperCase() : false;

    const successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    const timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' && requestProperties.body.timeoutSeconds > 0 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (phone && protocol && url && method && successCodes && timeoutSeconds) {
        lib.read('users', phone, (readingError, userData) => {
            if (!readingError && userData) {
                const token = typeof requestProperties.headersObject.token === 'string' && requestProperties.headersObject.token.length === 20 ? requestProperties.headersObject.token : false;

                tokenHandler._token.verify(token, phone, (isValid) => {
                    if (isValid) {
                        const user = parseJSON(userData);
                        const checks = typeof user.checks === 'object' && user.checks instanceof Array ? user.checks : [];

                        if (checks.length < 5) {
                            const checkId = generateRandomString(20);
                            const checkObject = {
                                checkId,
                                phone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds,
                            };

                            lib.create('checks', checkId, checkObject, (writingError) => {
                                if (!writingError) {
                                    user.checks = checks;
                                    user.checks.push(checkId);
                                    lib.update('users', phone, user, (writingError2) => {
                                        if (!writingError2) {
                                            callback(200, {
                                                message: 'Check added successfully!',
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Something went wrong!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        error: 'Something went wrong!',
                                    });
                                }
                            });
                        } else {
                            callback(500, {
                                error: 'Maximum checks limit reached!',
                            });
                        }
                    } else {
                        callback(403, {
                            error: 'Authorization failure!',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Requested user was not found!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'There is an error in your request!',
        });
    }
};

// handler._check.get = (requestProperties, callback) => {};
// handler._check.put = (requestProperties, callback) => {};
// handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
