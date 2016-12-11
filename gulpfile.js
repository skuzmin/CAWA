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
    gulpIf = require('gulp-if'),
    templateCache = require('gulp-angular-templatecache'),
    argv = require('yargs').argv,
    inject = require('gulp-inject');

//======= dev tasks
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

//======= build tasks
gulp.task('templates', function() {
    log('Gathering templates');

    return gulp.src(['source/app/**/*.html', '!source/app/index.tpl.html'])
        .pipe(minifyHtml())
        .pipe(templateCache({ module: 'app.core', root: 'app/' }))
        .pipe(gulp.dest('temp'));
});

gulp.task('styles', ['less'], function() {
    return gulp.src('source/styles/styles.css')
        .pipe(gulpIf(argv.prod, csso()))
        .pipe(gulp.dest('temp'));
});

gulp.task('vendor-styles', function() {
	log('Creating vendor Styles');
    var wiredep = require('wiredep');
    return gulp.src(wiredep().css)
        .pipe(gconcat('vendor.css'))
        .pipe(gulpIf(argv.prod, csso()))
        .pipe(gulp.dest('temp'));
});

gulp.task('js', ['jshint', 'templates'], function() {
	log('Creating app.js');
    var jsSources = ['source/app/app.js', 'source/app/**/*.module.js', 'source/app/**/*.js', 'temp/templates.js'];
    return gulp.src(jsSources)
        .pipe(gconcat('app.js'))
        .pipe(gulpIf(argv.prod, uglify()))
        .pipe(gulp.dest('temp'));
});

gulp.task('vendor-js', function() {
	log('Creating vendor JS');
    var wiredep = require('wiredep');
    return gulp.src(wiredep().js)
        .pipe(gconcat('vendor.js'))
        .pipe(gulpIf(argv.prod, uglify()))
        .pipe(gulp.dest('temp'));
});

//======= commands
gulp.task('build', ['styles', 'vendor-styles', 'js', 'vendor-js'], function() {
    var
        styles = gulp.src(['temp/vendor.css', 'temp/styles.css']),
        js = gulp.src(['temp/vendor.js', 'temp/app.js']);

    return gulp.src('source/app/index.tpl.html')
        .pipe(inject(styles.pipe(gulp.dest('public/dev/styles')), { ignorePath: '/public/dev', removeTags: true, addRootSlash: false }))
        .pipe(inject(js.pipe(gulp.dest('public/dev/js')), { ignorePath: '/public/dev', removeTags: true, addRootSlash: false }))
        .pipe(rename('index.html'))
        .pipe(gulpIf(argv.prod, minifyHtml()))
        .pipe(gulp.dest('public/dev'));
});

gulp.task('watch', ['inject'], function() {
	log('WATCHING...');
    gulp.watch('source/app/**/*.js', ['jshint']);
    gulp.watch('source/styles/*.less', ['less']);
});

gulp.task('default', ['watch']);


//=============Functions==============

function log(msg) {
    util.log(util.colors.blue(msg));
}
