/* @flow */
type Callback = (err: ?Error, results?: any) => void;
type Waterfall = (tasks: Function[], callback?: Callback) => void;

// import { rest } from lodash
function rest(func) {
      if (typeof func != 'function') {
        throw new TypeError('LODASH_FUNC_ERROR_TEXT');
      }
      const start = Math.max(func.length - 1, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = Math.max(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, array);
          case 1: return func.call(this, args[0], array);
          case 2: return func.call(this, args[0], args[1], array);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = array;
        return func.apply(this, otherArgs);
      };
    }

// import { waterfall } from async
function waterfall(tasks: Function[], callback?: Callback): void {
    if (!Array.isArray(tasks) && callback)
      return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length && callback) return callback(null);
    var taskIndex = 0;

    function nextTask(args) {
        if (taskIndex === tasks.length && callback) {
            return callback.apply(null, [null].concat(args));
        }

        var taskCallback = rest(function(err: ?Error, args: Array<any>) {
            if (err && callback) {
                return callback.apply(null, [err].concat(args));
            }
            nextTask(args);
        });

        args.push(taskCallback);

        var task = tasks[taskIndex++];
        task.apply(null, args);
    }

    nextTask([]);
}

waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});
