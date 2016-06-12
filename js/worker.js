/* @flow */
importScripts('flow.js');
postMessage({ flowVersion: flow.flowVersion });

function get(url) {
    return new Promise(function (resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function () {
        if (req.status == 200) {
          resolve([url, req.response]);
        } else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function () {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }

var libs = [
  '/js/flowlib/core.js',
  // '/js/flowlib/bom.js',
  // '/js/flowlib/cssom.js',
  // '/js/flowlib/dom.js',
  '/js/flowlib/node.js',
  // '/js/flowlib/react.js'
];

var libs1 = ['/static/flowlib/core.js'];


Promise.all(libs.map(get)).then(function (contents) {
   contents.forEach(function (nameAndContent) {
     flow.registerFile(nameAndContent[0], nameAndContent[1]);
   });
   return libs;
 }).then(function (libs) {
   flow.setLibs(libs);
   postMessage({
     flowReady: true,
   })
 }).catch(function(e) {
   console.log('Can\'t load libs', JSON.stringify(e[2]))
 });

function transformErrors(errors) {
  return errors.reduce(function(errors, error) {

    var description = error.message.length >= 5 ?
      error.message.slice(2, 5).map(function(e) { return e.descr}).join('\n') :
      error.message.map(function(e) {
        return e.path && e.path !== '/example.js' ? e.descr + ': ' + e.path + ':' + e.line + '\n' + e.context: e.descr;
      }).join('\n')

    var messages = error.message.map(function(message) {
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
