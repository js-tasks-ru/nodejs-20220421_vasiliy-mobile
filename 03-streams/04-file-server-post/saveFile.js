const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

function saveFile(filepath, req, res) {
  const limitStream = new LimitSizeStream({limit: 1048576}); // 1MB
  const fileStream = fs.createWriteStream(filepath);

  req.pipe(limitStream).pipe(fileStream);

  req.on('aborted', () => {
    fileStream.destroy();
    removeFile(filepath);
  });

  limitStream.on('error', (err) => fileStream.destroy(err));

  fileStream.on('finish', () => sendResponse(res, 201, 'OK'));

  fileStream.on('error', (err) => {
    if ('LIMIT_EXCEEDED' === err.code) {
      sendResponse(res, 413, 'Limit exceeded');
    } else {
      sendResponse(res, 500, 'Internal error');
    }

    removeFile(filepath);
  });
}

function sendResponse(res, code, message) {
  res.statusCode = code;
  res.end(message);
}

function removeFile(filepath, done) {
  fs.rm(filepath, (err) => {
    if (err) {
      console.error(err);
    }

    if (done) {
      done(err);
    }
  });
}

module.exports = saveFile;
