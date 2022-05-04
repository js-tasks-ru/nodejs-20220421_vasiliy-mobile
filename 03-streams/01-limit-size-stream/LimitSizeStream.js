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

    if (this.limit < this.totalSize) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
