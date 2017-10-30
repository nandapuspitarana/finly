'use strict';

// https://css-tricks.com/gulp-for-beginners/

// Documentation
// https://browsersync.io/docs/gulp
// https://browsersync.io/docs/options
// https://www.npmjs.com/package/gulp-sass
// https://www.npmjs.com/package/gulp-sourcemaps
// https://www.npmjs.com/package/gulp-autoprefixer
// https://www.npmjs.com/package/gulp-uglify
// https://github.com/robrich/gulp-if
// https://www.npmjs.com/package/gulp-cssnano
// var runSequence = require('run-sequence');

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('hello', function() {
  console.log('Hello Zell');
});

// gulp.task('watch', function(){
//   gulp.watch('app/scss/**/*.scss', ['sass']); 
//   // Other watchers

// })

// Start browserSync server
// gulp.task('browserSync', function() {
//     browserSync.init({
//         server: {
//             baseDir: 'app',
//             routes: {
//                 "/bower_components": "bower_components"
//             }
//         },
//     })
// });


// SASS Task
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app',
            routes: {
                "/bower_components": "bower_components"
            }
        },
    })
});


gulp.task('images', function(){
    return gulp.src('./app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe((imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});


gulp.task('fonts', function() {
  return gulp.src('./app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});


// Watchers
// ------------------
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/sass/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});


// Now Gulp will delete the `dist` folder for you whenever gulp clean:dist is run.
// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
})


gulp.task('default', function (callback) {
    runSequence(['sass','browserSync', 'watch' ],
        callback
    )
})


gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts','sass'],
    callback
  )
})
