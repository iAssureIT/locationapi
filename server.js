const http = require('http');
const app = require('./app'); // app file include
//const port = process.env.PORT || 3057;
const globalVariable = require('./nodemon');
//const port = process.env.PORT || 5006;
const port = process.env.PORT || globalVariable.PORT;

const server = http.createServer(app);

server.listen(port);


