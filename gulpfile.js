var gulp = require('gulp')
var shell = require('gulp-shell')

gulp.task('clean-docs', shell.task('make clean && rm -rf doxygenbuild/html/* && rm -rf ../docs/* && mkdir ../docs/classmap', {cwd: './rstdocs'}))

gulp.task('build-docs', shell.task('make html && cp -r build/html/* ../docs/', {cwd: './rstdocs'}))
gulp.task('build-classmap', shell.task('doxygen doxygen.conf && cp -r doxygenbuild/html/* docs/classmap/', {cwd: './'}))

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
