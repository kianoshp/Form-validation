var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var run = require('gulp-run');

gulp.task('babel', function() {
  return gulp.src('js/form-validation.js')
    .pipe(babel())
    .pipe(gulp.dest('js/es5'));
});

gulp.task('watch', function() {
  watch('js/*.js')
    .pipe(run('gulp babel'));
});

gulp.task('jscs', function() {

});