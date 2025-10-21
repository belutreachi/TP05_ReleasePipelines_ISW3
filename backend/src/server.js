const http = require('node:http');
const app = require('./app');
const config = require('./config/env');

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`API escuchando en http://localhost:${config.port} en modo ${config.nodeEnv}`);
});

module.exports = server;
