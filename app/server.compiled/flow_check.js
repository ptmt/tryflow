var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

module.exports = function(sourceCode, cb) {
  process.env.USER = 'user';
  child = spawn('flow', ['check-contents', '--json']); //'--no-auto-start'
  var output = '';
  child.stdout.on('data', function (data) {
    output += data;
  });

  child.stderr.on('data', function (data) {
    console.log('flow check stderr: ' + data);
  });

  child.on('close', function (code) {
    try {
      console.log(output);
      cb(JSON.parse(output));
    } catch(e) {
      console.log(e);
      cb({fatalError: true});
    }

  });
  child.stdin.setEncoding = 'utf-8';
  child.stdin.write(sourceCode + '\n');
  child.stdin.end();
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

module.exports.wrap = function(sourceCode, errorsJson) {
  if (errorsJson.passed) {
    return sourceCode;
  }
  if (errorsJson.fatalError) {
    return "Fatal Error, please try again";
  }
  // TODO: make it in functional programming way
  var sourceLines = sourceCode.split('\n');
  var compiledLines = [];
  var openings = {};
  var endings = {};

  errorsJson.errors.forEach(function(error) {
    var message1 = error.message[0];
    var message2 = error.message[1];
    var description = message2 ? message1.descr + '\n<strong>' + message2.descr + '</strong>': message1.descr;

  //  if (endings[(message1.endline - 1) + '_' + (message1.end)]) {
  //    endings[(message1.endline - 1) + '_' + (message1.end)].push('</span>');
//    } else
//    {
      endings[(message1.endline - 1) + '_' + (message1.end)] = ['</span>'];
//      }
    if (  openings[(message1.line - 1) + '_' + (message1.start - 1)]) {
      openings[(message1.line - 1) + '_' + (message1.start - 1)].push(description );

    } else {
      openings[(message1.line - 1) + '_' + (message1.start - 1)] = [description ];
    }

    // sourceLines[message1.endline - 1] = insert(sourceLines[message1.endline - 1]
    //   , message1.end
    //   , '</span>')
    //   sourceLines[message1.line - 1] = insert(sourceLines[message1.line - 1]
    //     , message1.start - 1
    //     , '<span class="error"><span class="tip">' + description + '</span>')
  });
  //console.log(openings);
  //console.log(endings);
  for (var i=0; i<sourceLines.length; i++) {
    var line = '';
    for(var j=0; j<sourceLines[i].length; j++) {
      var open = openings[i + '_' + j] ? '<span class="error"><span class="tip">' + openings[i + '_' + j].join('\n') + '</span>' : '';
      var close = endings[i + '_' + j] ? endings[i + '_' + j].join('') : '';
      line+= close + open + sourceLines[i][j];
    }
    compiledLines.push(line);
  }
  return compiledLines.join("\n");
}

module.exports.version = function(sourceCode) {
  child = exec('flow --version',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}
