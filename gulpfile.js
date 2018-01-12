var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify');


//Работа со Stylus
gulp.task('stylus', function () {
    return gulp.src('app/style/stylus/main.styl')
        .pipe(plumber())
        .pipe(stylus({
            'include css': true
        }))

    .on("error", notify.onError(function(error) {
        return "Message to the notifier: " + error.message;
    }))
    .pipe(autoprefixer(['last 2 version']))
    .pipe(gulp.dest('app/style/css'))
    .pipe(browsersync.reload({
        stream: true
    }));
})

//Работа с sass
gulp.task('sass', function () {
    return gulp.src('app/style/sass/main.sass')
        .pipe(plumber())
        .pipe(sass({
            'include css': true
        }))

        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(autoprefixer(['last 2 version']))
        .pipe(gulp.dest('app/style/css'))
        .pipe(browsersync.reload({
            stream: true
        }));
})

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('app/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('app'));
});

// Browsersync
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: 'app'
        },
    });
});

// Работа с JS
gulp.task('scripts', function() {
    return gulp.src([
        // Библиотеки
        'dev/static/libs/validate/jquery.validate.min.js'
    ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

// Слежение
gulp.task('watch', ['browsersync', 'stylus', 'scripts'], function() {
    gulp.watch('app/styles/stylus/**/*.styl', ['stylus']);
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('app/*.html', browsersync.reload);
    gulp.watch(['app/js/*.js'], ['scripts']);
});

// Очистка папки сборки
gulp.task('clean', function() {
    return del.sync('dist');
});

// Оптимизация изображений
gulp.task('img', function() {
    return gulp.src(['app/style/img/**/*'])
        .pipe(cache(imagemin({
            progressive: true,
            use: [pngquant()]

        })))
        .pipe(gulp.dest('app/style/img'));
});

// Сборка проекта

gulp.task('build', ['clean', 'img', 'stylus', 'scripts'], function() {
    var buildCss = gulp.src('app/style/css/*.css')
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/style/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/style/js/**.js')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});

// Очистка кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

// Дефолтный таск
gulp.task('default', ['watch']);
