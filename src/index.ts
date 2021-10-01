import Server from './server';

import {PORT} from './config/properties';

function start() {
  const server = new Server();
  server.listen(PORT);
}

start();
