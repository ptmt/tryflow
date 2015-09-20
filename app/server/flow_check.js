var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var Promise = require("bluebird");

module.exports = function(sourceCode) {
	return new Promise(function(resolve, reject) {
		process.env.USER = 'user';
		var child = spawn('flow', ['check-contents', '--json']); //'--no-auto-start'
		var output = '';
		child.stdout.on('data', function(data) {
			output += data;
		});

		child.stderr.on('data', function(data) {
			console.log('flow check stderr: ' + data);
		});

		child.on('close', function(code) {

			try {
				//console.log('OUTPUT', JSON.parse(output).errors);
				resolve(JSON.parse(output));
			} catch (e) {
				console.log(e);
				reject(new Error('Fatal Error'));
			}

		});
		child.stdin.setEncoding = 'utf-8';
		child.stdin.write(sourceCode + '\n');
		child.stdin.end();
	});
}

module.exports.autocompleteFor = function(sourceCode, row, column) {
	return new Promise(function(resolve, reject) {
		process.env.USER = 'user';
		var child = spawn('flow', ['autocomplete', row, column, '--json']); //'--no-auto-start'
		var output = '';
		child.stdout.on('data', function(data) {
			output += data;
		});

		child.stderr.on('data', function(data) {
			console.log('flow check stderr: ' + data);
		});

		child.on('close', function(code) {
			try {
				resolve(JSON.parse(output));
			} catch (e) {
				console.log(e, output);
				reject(new Error('Fatal Error'));
			}

		});
		child.stdin.setEncoding = 'utf-8';
		child.stdin.write(sourceCode + '\n');
		child.stdin.end();
	});
}

function insert(str, index, value) {
	return str.substr(0, index) + value + str.substr(index);
}

module.exports.transformErrors = function(errorsJson) {
	if (errorsJson.passed) {
		return [];
	}
	return errorsJson.errors.reduce(function(errors, error) {
		//error.message.filter(e => e.descr !== 'Error').
	  const description = error.message.length >= 5 ?
			error.message.slice(2, 5).map(e => e.descr).join('\n\t\t') :
			error.message.map(e => e.descr).join('\n\t\t')

		// 	{
		// 		row: error.message[2].line - 1,
		// 		column: error.message[2].start - 1,
		// 		columnEnd: error.message[2].end - 1,
		// 		text: description,
		// 		type: 'error'
		// 	}
		// } else {
		// 	//console.error(error.message);
		// 	var description = error.message.map(e => e.descr).join('\n\t\t')
		//
		// 	return {
		// 		row: error.message[0].line - 1,
		// 		column: error.message[0].start - 1,
		// 		columnEnd: error.message[0].end - 1,
		// 		text: description,
		// 		type: 'error'
		// 	}
		// }
		const messages = error.message.map(message => {
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

module.exports.version = function() {
	return new Promise(function(resolve, reject) {
		var child = exec('flow --version',
			function(error, stdout, stderr) {
				if (error || stderr) {
					reject(error || stderr);
				} else {
					resolve(stdout.split(',')[2].trim().split(' ')[1]);
				}
			});
	});
}

module.exports.availableVersion = function() {
	return new Promise(function(resolve, reject) {
		var child = exec('npm show flow-bin version',
			function(error, stdout, stderr) {
				if (error || stderr) {
					reject(error || stderr);
				} else {
					resolve(stdout.trim());
				}
			});
	});
}


module.exports.installNewVersion = function() {
	console.log('install new version of flow-bin');
	var child = spawn('npm', ['install', 'flow-bin', '-g']);
  var output = '';
	child.stdout.on('data', function(data) {
		output+= data;
	});

	child.stderr.on('data', function(data) {
		console.log('error:'+ data);
	});

  child.on('close', function(code) {
    console.log(output);
    child = exec('flow stop');
  });

	child.stdin.setEncoding = 'utf-8';
  child.stderr.setEncoding = 'utf-8';
  child.stdout.setEncoding = 'utf-8';
	child.stdin.write('install flow-bin');
	child.stdin.end();
}
