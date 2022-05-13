const fs = require('fs');

function sendFile(filepath, req, res) {
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
}

module.exports = sendFile;
