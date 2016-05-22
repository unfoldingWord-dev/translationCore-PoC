'use strict'

let isProd = process.env.node_env === 'production'

let gulp        = require('gulp'),
    path        = require('path'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    stringify   = require('brfs'),
    less        = require('gulp-less'),
    eslint      = require('gulp-eslint'),
    minifycss   = require('gulp-minify-css'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    connect     = require('gulp-connect')

gulp.task('js', () => {
  return browserify({ entries: './app/src/app.js', debug: isProd })
    .transform('babelify', { presets: ['es2015', 'react'] })
    .transform('brfs')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    //.pipe(sourcemaps.init())
    //.pipe(uglify())
    //.pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('public/js'))
    .pipe(connect.reload())
})

gulp.task('less', () => {
  return gulp.src('app/less/main.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
    .pipe(connect.reload())
})

gulp.task('html', () => {
  return gulp.src('public/**/*.html')
    .pipe(connect.reload())
})

gulp.task('lint', () => {
  return gulp.src(['app/src/**/*.js', '!node_modules/**'])
    .pipe(eslint({
      extends: 'airbnb',
      plugins: [
        'react'
      ],
      ecmaFeatures: {
        modules:  true,
        jsx:      true
      },
      rules: {
        strict: 2,
        'no-console': isProd ? 1 : 0,
        semi: 0
      },
      envs: ['browser', 'es6', 'node']
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('connect', () => {
  return connect.server({
    root: 'public',
    livereload: true
  })
})

gulp.task('watch', ['build'], () => {
  gulp.watch('app/src/**/*.js', ['lint', 'js'])
  gulp.watch('app/less/**/*.less', ['less'])
  gulp.watch('public/**/*.html', ['html'])
  gulp.watch('app/templates/**/*.html', ['js'])
})

gulp.task('build', ['lint', 'js', 'less'])
gulp.task('serve', ['js', 'less', 'connect', 'watch'])
gulp.task('default', ['build'])
