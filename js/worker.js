/* @flow */
importScripts('flow.js');
postMessage({ flowVersion: flow.flowVersion });

function transformErrors(errors) {
  return errors.reduce(function(errors, error) {

    var description = error.message.length >= 5 ?
      error.message.slice(2, 5).map(function(e) { return e.descr}).join('\n') :
      error.message.map(function(e) { return e.descr }).join('\n')
     messages = error.message.map(function(message) {
      return {
        row: message.line - 1,
        column: message.start - 1,
        columnEnd: message.end - 1,
        text: description,
        type: 'error'
      }
    });
    return errors.concat(messages)
  }, []);
}

onmessage = function(e) {
  if (e.data.inferTypeAt) {
    try {
      var line = parseInt(e.data.inferTypeAt.row, 10) + 1;
      var column = parseInt(e.data.inferTypeAt.column, 10) + 1;
      var res = flow.typeAtPos(
        '/example.js',
        e.data.text,
        line,
        column);
      postMessage({
        inferredType: res[1].c
      });
    } catch (e) {
      // don't care
      return null
    }
  }
  if (e.data.flowCheck) {
    try {
      var results = flow.checkContent('/example.js', e.data.text)
      var annotations = transformErrors(results)
      postMessage({
        flowResults: annotations,
        flowCheck: true,
      });
    } catch (e) {
      // don't care
      console.log(JSON.stringify(e))
      return null
    }

  }

}
