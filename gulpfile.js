var gulp = require('gulp');
var browserify = require('browserify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var autoprefixer = require('gulp-autoprefixer');


var paths = {
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.*',
    css: 'src/css/**/*.css'
};

gulp.task('css', function() {
    return gulp.src(['src/css/normalize.css', 'src/css/main.css'])
        .pipe(concat('styles.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dest/css'))
});

gulp.task('img', function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest('dest/img'));
});

gulp.task('js', function () {
    return browserify({entries: ['src/js/main.js']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dest/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.img, ['img']);
    gulp.watch(paths.css, ['css']);
});

gulp.task('default', ['js', 'img', 'css', 'watch']);