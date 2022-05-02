const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit || 0;
    this.totalSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.totalSize += Buffer.byteLength(chunk);
    let error = null;

    if (this.limit < this.totalSize) {
      error = new LimitExceededError();
    }

    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
