const http = require('http');
const path = require('path');
const fs = require('fs');

const isPathOfFirstLevel = require('./isPathOfFirstLevel');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (!isPathOfFirstLevel(pathname)) {
        res.statusCode = 400;
        res.end('Included path not supported');

        return;
      }

      const fileStream = fs.createReadStream(filepath);

      fileStream.pipe(res);

      fileStream.on('error', (err) => {
        if ('ENOENT' === err.code) {
          res.statusCode = 404;
          res.end('File not exists');
        } else {
          res.statusCode = 500;
          res.end('Internal error');
        }
      });

      req.on('aborted', () => {
        fileStream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
