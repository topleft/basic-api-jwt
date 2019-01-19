/* eslint-disable node/no-unpublished-require */
/* eslint-disable node/no-extraneous-require */
/* eslint-disable no-console */

// *** dependencies *** //

const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const server = require('tiny-lr')();

// *** config *** //

const paths = {
  scripts: [
    path.join('src', '**', '*.js'),
    path.join('src', '**', '**', '*.js'),
    path.join('src', '*.js')
  ],
  server: path.join('src', 'server', 'server.js'),
  dist: path.join('dist')
};

const lrPort = 35729;

const nodemonConfig = {
  script: paths.server,
  ext: 'html js css',
  ignore: ['node_modules'],
  env: {
    NODE_ENV: 'development'
  }
};

// *** sub tasks ** //

gulp.task('eslint', () => {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lr', () => {
  server.listen(lrPort, err => {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('nodemon', () => {
  return nodemon(nodemonConfig);
});

gulp.task('watch', () => {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['eslint']);
  gulp.watch(paths.styles, ['styles']);
});

// *** default task *** //

gulp.task('default',
  gulp.series(
    'eslint',
    'nodemon',
    'lr',
    'watch'
  )
);
