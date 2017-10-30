'use strict' //js reset

//  https://css-tricks.com/gulp-for-beginners/

//========================SOME VAR HERE!! for REQUIRE======
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');



// ===========test hello gulp
gulp.task('hello', function() {
  console.log('Hello laptopapik');
});




// ==============SASS TASK HERE ============
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') //edit this // ** = semua file
  .pipe(sourcemaps.init()) //some sourcemaps
    .pipe(sass().on('error', sass.logError)) //convert Sass to CSS
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    })) //edit this
});

 
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', ['sass']); //edit this
});


//===================== BROSWER SYNC======  
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app', //file exist
      routes: {
        "/bower_components": "bower_components" //add link for bower to browsersyn
    }
    },

  })
})   //browsersync.io/docs/gulp

// //=================== USEREF===============
// gulp.task('useref', function(){
//   return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulp.dest('dist'))
// });

//============== CSSNANO ===============
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

//===================  UGLIFY & GULPIF=========
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

//================IMAGEMIN + CACHE==============
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe((imagemin({    // delete cache if folder not show
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

//===================FONTS===============
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//================CLEANING===========
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//=================run-sequence task-name==========
gulp.task('task-name', function(callback) {
  runSequence('task-one', 'task-two', 'task-three', callback);
});


// ===================== GULP WATCH========
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  // Other watchers
})

//===============COMPAILE===========
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})