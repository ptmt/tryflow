/* @flow */
function length(x) {
  if (x) {
    if (typeof x === 'string')
    {
      return x.length;
    }
    return x
  } else {
    return 0;
  }
}
