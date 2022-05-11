const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.lastLine = '';
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split(os.EOL);
    const lastLineIndex = lines.length - 1;

    lines.forEach((line, index) => {
      if (0 === index && this.lastLine) {
        this.push(this.lastLine + line);
        this.lastLine = '';

        return true; // continue
      }

      if (index < lastLineIndex) {
        this.push(line);
      } else {
        this.lastLine = line;
      }
    });

    callback(null);
  }

  _flush(callback) {
    const line = this.lastLine;
    this.lastLine = '';

    callback(null, line);
  }
}

module.exports = LineSplitStream;
