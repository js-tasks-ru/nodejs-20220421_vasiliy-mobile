const http = require('http');
const path = require('path');
const fs = require('fs');

const saveFile = require('./saveFile');

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

  const filepath = path.join(FILES_ROOT, pathname);

  switch (req.method) {
    case 'POST':
      if (!pathname || /[\/\\]/.test(pathname)) {
        res.statusCode = 400;
        res.end('Path not supported');

        return;
      }

      fs.stat(filepath, (err) => {
        if (err) {
          if ('ENOENT' === err.code) {
            saveFile(filepath, req, res);
          } else {
            res.statusCode = 500;
            res.end('Internal error');
          }

          return;
        }


        res.statusCode = 409;
        res.end('File already exists');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
