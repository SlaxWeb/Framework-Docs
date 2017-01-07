var gulp = require('gulp')
var shell = require('gulp-shell')

gulp.task('build-docs', shell.task('make html', {cwd: './rstdocs'}))

gulp.task('clean-docs', shell.task('make clean', {cwd: './rstdocs'}))

gulp.task('docs', ['build-docs'], function() {
  gulp.watch(
      [
          './rstdocs/**/*.rst',
          './rstdocs/**/*.py'
      ], [
          'build-docs'
      ]
  )
})
