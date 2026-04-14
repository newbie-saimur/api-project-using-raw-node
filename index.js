// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleRegRes');
const environment = require('./helpers/environments');
// const lib = require('./lib/data');

// App Object - Module Scaffolding
const app = {};

// Create data (Write to file)
// lib.create('', 'test', { name: 'Bangladesh', language: 'Bengali' }, (err) => {
//     if (!err) {
//         console.log('File Created Successfully!');
//     } else {
//         console.log(err);
//     }
// });

// Read data (Read from file)
// lib.read('', 'test', (err, data) => {
//     if (!err) {
//         console.log(data);
//     } else {
//         console.log(err);
//     }
// });

// Update data (Update data to file)
// lib.update('', 'test', { name: 'America', language: 'English' }, (err) => {
//     if (!err) {
//         console.log('Updating Successful');
//     } else {
//         console.log(err);
//     }
// });

// Delete data (Delete data from file)
// lib.delete('', 'test', (err) => {
//     if (!err) {
//         console.log('Successfully Deleted!');
//     } else {
//         console.log(err);
//     }
// });

// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// Handle Request Response
app.handleReqRes = handleReqRes;

// Start the Server
app.createServer();
