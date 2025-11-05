const http = require('node:http');
const app = require('./app');
const config = require('./config/env');

const server = http.createServer(app);


const PORT = process.env.PORT || config.port || 3000;

console.log("Usando puerto:", PORT);

server.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT} en modo ${config.nodeEnv}`);
});

module.exports = server;
