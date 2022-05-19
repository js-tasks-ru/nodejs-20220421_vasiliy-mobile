const http = require('http');
const path = require('path');
const fs = require('fs');

const isPathOfFirstLevel = require('./isPathOfFirstLevel');
const removeFile = require('./removeFile');

const FILES_ROOT = path.join(__dirname, 'files');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname.slice(1);

  try {
    pathname = decodeURIComponent(pathname);
  } catch (e) {
    res.statusCode = 400;
    res.end('Path not supported');

    return;
  }

  if (-1 !== pathname.indexOf('\0')) {
    res.statusCode = 400;
    res.end('Path not supported');

    return;
  }

  const filepath = path.normalize(path.join(FILES_ROOT, pathname));

  if (0 !== filepath.indexOf(FILES_ROOT)) {
    res.statusCode = 400;
    res.end('Path not supported');

    return;
  }

  switch (req.method) {
    case 'DELETE':
      if (!isPathOfFirstLevel(pathname)) {
        res.statusCode = 400;
        res.end('Path not supported');

        return;
      }

      fs.stat(filepath, (err) => {
        if (err) {
          if ('ENOENT' === err.code) {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end('Internal error');
          }

          return;
        }

        removeFile(filepath, req, res);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
