const express = require('express');

function web() {
  // web server to keep Bloo awake
  const app = express();
  app.get('*', (req, res) => res.end('Bloo'));
  const server = app.listen(process.env.PORT || 3000);
  return server;
}

module.exports = web;
