'use strict';

var gulp           = require('gulp');
var del            = require('del');
var autoprefixer   = require('gulp-autoprefixer');
var cache          = require('gulp-cache');
var concat         = require('gulp-concat');
var imagemin       = require('gulp-imagemin');
var jscs           = require('gulp-jscs');
var jshint         = require('gulp-jshint');
var size           = require('gulp-size');
var sourcemaps     = require('gulp-sourcemaps');
var sftp           = require('gulp-sftp');
var stylint        = require('gulp-stylint');
var stylus         = require('gulp-stylus');
var uglify         = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');

var browserSync    = require('browser-sync').create();
var pjson = require('./package.json');

// Удаляет все содержимое папки build и src/lib
gulp.task('clean', function() {
    return del.sync(['build/**', 'src/lib/**']);
});

// Очищает кэш файлов
gulp.task('clear', function(done) {
    return cache.clearAll(done);
});

// Конкатинирует и минифицирует JavaScript, создает sourseMap
gulp.task('scripts', function() {
    return gulp.src([
        'src/js/*.js',
        'src/js/UI/*.js',
        'src/js/**/*.js',
        'src/lib/three.js',
        'src/lib/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('tour-player.js'))
    .pipe(uglify({
        preserveComments: 'some',
        outSourceMap: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/'))
    .pipe(size({title: 'scripts'}));
});

// Конкатинирует и минифицирует CSS, STYLUS, создает sourseMap
gulp.task('styles', function() {
    return gulp.src(['src/css/dependences.styl'])
    .pipe(sourcemaps.init())
    .pipe(concat('tour-player.styl'))
    .pipe(stylus({compress: true}))
    .pipe(autoprefixer({browsers: ['last 5 versions']}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/'))
    .pipe(size({title: 'styles'}));
});

// Сжимает изображения (gif, jpg, png, svg) без потерь
gulp.task('images', function() {
    return gulp.src(['src/img/**/*'])
    .pipe(cache(imagemin({
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest('build/img'))
    .pipe(size({title: 'images'}));
});

//Копирует главные файлы из bower_components/ в src/lib/
gulp.task('mainBowerFiles', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('src/lib'));
});

// Проверка всех JS файлов в папке src/js
gulp.task('jslint', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default', { verbose: true }));
});

// Проверка стиля javascript
gulp.task('jscs', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(jscs())
        .pipe(jscs.reporter());
});

// Проверка всех stylus файлов в папке src/css
gulp.task('stylint', function() {
    return gulp.src('src/css/**/*.styl')
        .pipe(stylint())
        .pipe(stylint.reporter())
        .pipe(stylint.reporter('fail'));
});

// Запускает локальный http сервер, следит за изменениями
gulp.task('serve', ['build'], function() {
    browserSync.init({
        notify: false,
        server: './',
        startPath: '/example/'
    });

    gulp.watch(['example/*'], browserSync.reload);
    gulp.watch(['src/js/**/*.js', 'src/lib/*.js'], ['scripts', browserSync.reload]);
    gulp.watch(['src/css/**/*.{css,styl}', 'src/lib/*.css'], ['styles', browserSync.reload]);
});

//Публикация на сайте tour-360.ru по FTP
gulp.task('deploy', function() {
    gulp.src(['build/**/*'])
        .pipe(sftp({
            host: 'tour-360.ru',
            auth: 'admin',
            remotePath: '/var/www/tour-360.ru/tour-player/latest'
        }));
    gulp.src(['build/**/*'])
        .pipe(sftp({
            host: 'tour-360.ru',
            auth: 'admin',
            remotePath: '/var/www/tour-360.ru/tour-player/' + pjson.version
        }));
});

gulp.task('lint', ['jscs','stylint']);
gulp.task('build', ['clean', 'clear', 'mainBowerFiles'], function() {
    gulp.run(['scripts', 'styles']);
});
gulp.task('default', ['build']);
