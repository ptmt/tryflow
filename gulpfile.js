'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('client-flow', function() {
	return gulp.src([
    'app/client/**/**.js',
    ])
		.pipe($.flowtype({
			declarations: './app/interfaces'
		}));
});

// Workaround for https://github.com/gulpjs/gulp/issues/71
var origSrc = gulp.src;
gulp.src = function() {
	return fixPipe(origSrc.apply(this, arguments));
};

function fixPipe(stream) {
	var origPipe = stream.pipe;
	stream.pipe = function(dest) {
		arguments[0] = dest.on('error', function(error) {
			var nextStreams = dest._nextStreams;
			if (nextStreams) {
				nextStreams.forEach(function(nextStream) {
					nextStream.emit('error', error);
				});
			} else if (dest.listeners('error').length === 1) {
				throw error;
			}
		});
		var nextStream = fixPipe(origPipe.apply(this, arguments));
		(this._nextStreams || (this._nextStreams = [])).push(nextStream);
		return nextStream;
	};
	return stream;
}

function scripts(watch) {
	var browserify = require('browserify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');
	var reactify = require('reactify');
	var watchify = require('watchify');

	var bundler = browserify({
		entries: ['./app/client/app.js'],
		debug: true,
		cache: {}, // required for watchify
		packageCache: {}, // required for watchify
		fullPaths: watch, // required to be true only for watchify

	});

	if (watch) {
		bundler = watchify(bundler)
	}

	bundler.transform('reactify', {
		es6: true,
		stripTypes: true
	})

	var rebundle = function() {
		return fixPipe(bundler
				.bundle()
				.pipe(source('app.js')))
			.pipe(buffer())
			.pipe($.sourcemaps.init({
				loadMaps: true
			}))
			//.pipe($.uglify())
			//  .pipe($.sourcemaps.write('./'))
			.pipe(gulp.dest('./dist/scripts/'))
			.pipe($.livereload())
			.on('error', function(error) {
				console.error('' + error);
			});
	};

	bundler.on('update', rebundle);
	return rebundle();
}

// Scripts
gulp.task('scripts', function() {
	return scripts(false);
});

// Scripts
gulp.task('scripts:watch', function() {
	return scripts(true);
});

// HTML
gulp.task('html', function() {
	return gulp.src('app/*.html')
		//.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size())
		.pipe($.livereload());
});

// Images
gulp.task('images', function() {
	return gulp.src('app/images/**/*')
		.pipe($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size())
		.pipe($.livereload());
});

gulp.task('test', function() {
	//require('common-node').run('./node_modules/.bin/_mocha');
});

// Clean
gulp.task('clean', function() {
	return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
		read: false
	}).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['scripts:watch', 'images', 'less', 'fonts', 'bower']);

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['watch']);

gulp.task('flow', function() {
	return gulp.src([
        'app/server/**/**.js',
        ])
		// .pipe($.flowtype({
		//   declarations: './app/interfaces'
		// }))
		.pipe($.react({
			stripTypes: true,
			harmony: true
		}))
		// Output each file into the ./build/javascript/ directory
		.pipe(gulp.dest('./app/server.compiled/'))
		.on('error', function(error) {
			console.error('' + error);
		});
});

gulp.task('server:start', ['flow'], function() {
	$.developServer.listen({
		path: './app/server.compiled/index.js'
	}, $.livereload.listen);
});

// Bower helper
gulp.task('bower', function() {
	gulp.src('app/bower_components/**/*.js', {
			base: 'app/bower_components'
		})
		.pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('fonts', function() {
	gulp.src('./app/fonts/*.*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('less', function() {
	gulp.src('./app/less/app.less')
		.pipe($.less({
			paths: ['./app/less/*.less'] //require('path').join(__dirname, 'less', 'includes')
		}))
		.pipe(gulp.dest('./dist/styles'))
		.pipe($.livereload());
});

gulp.task('server:restart', ['flow'], function() {
	$.developServer.changed(function(error) {
		if (!error) $.livereload.changed();
	});
});

// Watch
gulp.task('watch', ['html', 'bundle', 'server:start'], function() {

	// Watch server-side js files
	gulp.watch(['app/server/**/*.js', 'app/interfaces/**/*.js'], [
		'server:restart']); //.on( 'change', restart );;

	// Watch .html files
	gulp.watch('app/*.html', ['html']);

	// Watch .jade files
	//gulp.watch('app/template/**/*.jade', ['jade', 'html']);

	// Watch .css files
	gulp.watch('app/less/*.less', ['less']);

	// Watch client .js files
	//dgulp.watch('app/client/**/*.js', ['client-flow']);

	// Watch image files
	gulp.watch('app/images/**/*', ['images']);
});
