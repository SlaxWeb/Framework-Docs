var gulp = require('gulp')
var shell = require('gulp-shell')

gulp.task('build-docs', shell.task('make html', {cwd: './docs'}))

gulp.task('clean-docs', shell.task('make clean', {cwd: './docs'}))

gulp.task('docs', ['build-docs'], function() {
  gulp.watch(
      [
          './docs/**/*.rst',
          './docs/**/*.py'
      ], [
          'build-docs'
      ]
  )
})
