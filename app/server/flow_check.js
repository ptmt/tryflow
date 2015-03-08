var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var Promise = require("bluebird");

module.exports = function(sourceCode) {
	return new Promise(function(resolve, reject) {
		process.env.USER = 'user';
		child = spawn('flow', ['check-contents', '--json']); //'--no-auto-start'
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
	//console.log(sourceCode, row, column);
	return new Promise(function(resolve, reject) {
		process.env.USER = 'user';
		child = spawn('flow', ['autocomplete', row, column, '--json']); //'--no-auto-start'
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
	return errorsJson.errors.map(function(error) {
		var message1 = error.message[0];
		var message2 = error.message[1];
		var description = message2 ? message1.descr + '\n  ' + message2.descr + '' :
			message1.descr;

		return {
			row: message1.line - 1,
			column: message1.start - 1,
			text: description,
			type: 'error'
		}
	});
}

module.exports.version = function(callback) {
	child = exec('flow --version',
		function(error, stdout, stderr) {
			callback(error || stderr, stdout.split(',')[2].trim().split(' ')[1]);
		});
}

module.exports.availableVersion = function() {
	return new Promise(function(resolve, reject) {
		child = exec('npm show flow-bin version',
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
	child = spawn('npm', ['install', 'flow-bin', '-g']);
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
