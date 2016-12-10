var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    gconcat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    util = require('gulp-util'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    csso = require('gulp-csso'),
    filter = require('gulp-filter'),
    gulpIf = require('gulp-if'),
    useref = require('gulp-useref'),
    templateCache = require('gulp-angular-templatecache'),
    argv = require('yargs').argv,
    inject = require('gulp-inject');

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
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gconcat('styles.css'))
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


gulp.task('inject', ['jshint', 'less'], function() {
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

gulp.task('templates', function() {
    log('Gathering templates');

    return gulp.src('source/app/**/*.html')
        .pipe(minifyHtml())
        .pipe(templateCache())
        .pipe(gulp.dest('temp'));
});


gulp.task('watch', function() {
    gulp.watch('source/app/**/*.js', ['jshint']);
    gulp.watch('source/styles/*.less', ['less']);
});

gulp.task('default', ['inject']);


//=============Functions==============

function log(msg) {
    util.log(util.colors.blue(msg));
}
