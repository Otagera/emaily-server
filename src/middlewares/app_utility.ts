import * as http from 'http';
import debug from 'debug';

const localDebug = debug('emaily:server');

/**
 * Normalize a port into a number, string, or false.
 */

export const normalizePort = (val: any) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) { return val; }

  if (port >= 0) { return port; }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

export const onError = (error: any, port: string) => {
  if (error.syscall !== 'listen') { throw error; }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

export const onListening = (server: http.Server, port: string) => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : (addr)? 'port ' + addr.port: '';
  localDebug('Listening on ' + bind);
  console.log("=============");
  console.log("App is listening from port: " + port);
  console.log("=============");
}