'use strict';


/**
 * Module dependencies.
 */
const fs      = require('fs');
const path    = require('path');
const express = require('express');
const debug   = require('debug')('faststart');
const http    = require('http');
const app     = express();

require('./globals');
//get controllers
Controller.heirs = {};
fs.readdirSync(path.resolve(__dirname, '../app/controllers/')).filter(filename => {
    return filename.indexOf('.js') !== 0 && filename.indexOf('_') !== 0;
}).forEach(filename => {
    filename = filename.replace('.js','');
    Controller.heirs[filename] = require(path.resolve(__dirname, '../app/controllers/', filename));
});

// get routes
require(path.resolve(__dirname, '../app/routes'));
//aply routes
app.use('/', Route.__get_router());

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3333');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log(`Server start at localhost:${port}`);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

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

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
