var gulp = require('gulp')
  , less = require('gulp-less')
  , autoprefixer = require('gulp-autoprefixer')
  , cleancss = require('gulp-clean-css')
  , uglify = require('gulp-uglify')
  , notify = require('gulp-notify')
  , plumber = require('gulp-plumber')
  , cached = require('gulp-cached')
  , del = require('del')
  , requirejsOptimize = require('gulp-requirejs-optimize')
  , sourcemaps = require('gulp-sourcemaps')
  , strip = require('gulp-strip-comments')
  , rev = require('gulp-rev')
  , config = require('./config')

var STATIC = config.STATIC
  , STYLES_WILDCARD = STATIC + '/styles/**/*.less'
  , SCRIPTS_WILDCARD = STATIC + '/scripts/page/**/*.js'

function errorHandler(err) {
  console.error('Compile Error:', err.message)
}

gulp.task('style', function () {
  cached.caches = {}
  del([STATIC + '/css']).then(function () {
    gulp.src([STYLES_WILDCARD])
      .pipe(plumber({
        errorHandler: errorHandler
      }))
      .pipe(cached('styles'))
      .pipe(less({
        paths: [STATIC + '/styles']
      }))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(cleancss())
      .pipe(rev())
      .pipe(gulp.dest(STATIC + '/css'))
      .pipe(rev.manifest(STATIC + '/css/rev-manifest.json', {
        base: STATIC,
        merge: true
      }))
      .pipe(gulp.dest(STATIC))
      .pipe(notify({
        message: 'Styles task complete'
      }))
  })
})

gulp.task('script', function () {
  cached.caches = {}
  del([STATIC + '/js']).then(function () {
    gulp.src(SCRIPTS_WILDCARD, {
        base: STATIC + '/scripts'
      })
      .pipe(plumber({
        errorHandler: errorHandler
      }))
      .pipe(cached('scripts'))
      .pipe(requirejsOptimize())
      .pipe(strip())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rev())
      .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '/scripts'
      }))
      .pipe(gulp.dest(STATIC + '/js'))
      .pipe(rev.manifest(STATIC + '/js/rev-manifest.json', {
        base: STATIC,
        merge: true
      }))
      .pipe(gulp.dest(STATIC))
      .pipe(notify({
        message: 'Scripts task complete'
      }))
  })
})

gulp.task('default', ['script', 'style'])
