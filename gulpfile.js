var gulp = require('gulp')
var shell = require('gulp-shell')

gulp.task('build-docs', 
  shell.task('sphinx-build -b html sources/ /www/docs'))

gulp.task('watch', function() {
  gulp.watch('./sources/*.rst', ['build-docs'])
})

gulp.task('default', ['watch'], function(){})
