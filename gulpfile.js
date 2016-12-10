var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    concatCss = require('gulp-concat-css'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject');

//watchers
gulp.task('watch', function() {
    gulp.watch('source/app/**/*.js', ['jshint']);
    gulp.watch('source/styles/*.less', ['less']);
});

//gulp tasks
gulp.task('less', function() {
    return gulp.src('source/styles/index.less')
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(concatCss('styles.css'))
        .pipe(gulp.dest('source/styles/'));
});

gulp.task('jshint', function() {
    return gulp.src('source/app/**/*.js')
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


//gulp commands
gulp.task('default', ['watch']);
