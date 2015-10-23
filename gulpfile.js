var browserify = require('browserify');
var watchify = require('watchify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var babelify = require('babelify');
var clean = require("gulp-clean");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task("clean", function() {
    return gulp.src("./dest/**.*")
        .pipe(clean());
});
gulp.task('html', function() {
    return gulp.src("./src/test/*.html")
        .pipe(gulp.dest('./dest/html/'))
});
gulp.task('jsxTest', function() {
    return browserify({
            entries: './src/test/app.jsx',
            debug: true,
            // defining transforms here will avoid crashing your stream
            transform: [babelify]
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dest/js/'))
});
gulp.task('uglifyTest', ['jsxTest'], function() {
    return gulp.src('./dest/js/bundle.js')
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('./dest/js/'))
});
gulp.task("watch", function() {
    gulp.watch("./src/test/**.*", ["clean", "html","uglifyTest"]);
});
gulp.task("default", ["clean", "html","uglifyTest"]);