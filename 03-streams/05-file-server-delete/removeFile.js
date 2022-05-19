const fs = require('fs');

function removeFile(filepath, req, res) {
  fs.rm(filepath, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal error');
    }

    res.statusCode = 200;
    res.end('OK');
  });
}

module.exports = removeFile;
