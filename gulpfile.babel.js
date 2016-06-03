'use strict';

import gulp    from 'gulp';
import connect from 'gulp-connect';
import sass    from 'gulp-sass';

const paths = {
  root: './app',
  dirStyles: './app/stylesheets',
  html : './app/index.html',
  css: './app/stylesheets/style.css',
  sass: './app/stylesheets/scss/*.scss',
  js: './app/main.js'
}

gulp.task('connect', () => {
  connect.server({
    root: paths.root,
    host: '0.0.0.0',
    port: 3000,
    livereload: true
  });
})

gulp.task('html', () => {
  gulp.src(paths.html)
    .pipe(connect.reload());
});

gulp.task('sass', () => {
  gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.dirStyles))
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['html']);
});

gulp.task('default', ['connect', 'watch', 'sass']);
