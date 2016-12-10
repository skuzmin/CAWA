var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    concatCss = require('gulp-concat-css'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject');

// watchers
gulp.task('watch', function() {
    gulp.watch('source/app/**/*.js', ['jshint']);
    gulp.watch('source/styles/*.less', ['less']);
});

// tasks
gulp.task('less', function() {
    log('Compiling LESS');
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
    log('Checking JS');
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


gulp.task('inject', function() {
    var
        wiredep = require('wiredep').stream,
        jsSources = ['source/app/app.js', 'source/app/**/*.module.js', 'source/app/**/*.js'],
        cssSources = ['source/styles/*.css'],
        sources = [].concat(jsSources, cssSources);

    log('Injecting files');

    return gulp.src('source/app/index.tpl.html')
        .pipe(wiredep({ ignorePath: '../' }))
        .pipe(inject(gulp.src(sources), { ignorePath: '/source' }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('source'));
});

// commands
gulp.task('default', ['inject']);

//TODO add dev build
//TODO add prod build

//=============Functions==============

function log(msg) {
    util.log(util.colors.blue(msg));
}
