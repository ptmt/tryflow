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
    debug: !(process.env && process.env.NODE_ENV && process.env.NODE_ENV ===
      'production'),
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
    var t = bundler
      .bundle()
      .on('error', console.log)
      .pipe(source('app.js'))
      .pipe(buffer())
    if (!(process.env && process.env.NODE_ENV && process.env.NODE_ENV ===
        'production')) {
      t.pipe($.sourcemaps.init({
        loadMaps: true // TODO: typed sourcemaps
      }))
    }
    if ((process.env && process.env.NODE_ENV && process.env.NODE_ENV ===
        'production')) {
      console.log('uglify', process.env.NODE_ENV);
      t = t.pipe($.uglify());
    }
    return t
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/scripts/'))
      .pipe($.livereload());
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
  console.log('scripts:watch');
  return scripts(true);
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
    .pipe($.size())
    .pipe($.livereload());
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    read: false
  }).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['less', 'fonts', 'bower']);

// Build
gulp.task('build', ['html', 'scripts', 'bundle', 'flow']);

// Default task
gulp.task('default', ['watch', 'scripts:watch']);

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
  gulp.src('./node_modules/font-awesome/fonts/*.*')
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

  // Watch .css files
  gulp.watch('app/less/*.less', ['less']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
});
