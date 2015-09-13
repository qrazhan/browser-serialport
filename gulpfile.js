var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    jshint = require('gulp-jshint'),
    jshintReporter = require("jshint-stylish");




gulp.task("jshint", function() {
    return gulp.src(["./vim/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter(jshintReporter));
});



gulp.task('browserify', function() {

    return gulp.src(['./vim/vim.js'])
        .pipe(browserify({
            debug : true,
            "fullPaths": true
        }))
        .pipe(gulp.dest('./vim/build/'))
        .on('end', livereload('.js'));

});



var livereloadServer = null;
var livereload = function (_file) {
    return function (_path) {
        if (livereloadServer) livereloadServer.changed(_file);
    }
}

gulp.task('watch', function() {
    livereloadServer = require('gulp-livereload')();

    gulp.watch(['./vim/**/*.js', './*.js'], ['build']);
});


gulp.task('build', [
    'jshint',
    'browserify'
]);


gulp.task('default', [
    'watch',
    'build'
]);
