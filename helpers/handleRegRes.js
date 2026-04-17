// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// App Object - Module Scaffolding
const handler = {};

// Handle Request Response
handler.handleReqRes = (req, res) => {
    // Request Handling
    const parsedUrl = url.parse(req.url, true); // True means allow query params for parsing
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        queryStringObject,
        method,
        headersObject,
    };

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            const code = typeof statusCode === 'number' ? statusCode : 500;
            const payloadData = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payloadData);

            res.writeHead(code);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
