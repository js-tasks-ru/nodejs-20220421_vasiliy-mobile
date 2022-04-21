function sum(a, b) {
  if ('number' !== typeof a || 'number' !== typeof b) {
    throw new TypeError('Type of arguments not is number');
  }

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new RangeError('Value of arguments out of range');
  }

  return a + b;
}

module.exports = sum;
