const http = require('http');
const app = require('./app'); // app file include
//const port = process.env.PORT || 3002;
const port = process.env.PORT || 3057;

const server = http.createServer(app);

server.listen(port);


