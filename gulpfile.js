var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	concatCss = require('gulp-concat-css'),
	inject = require('gulp-inject');

//watchers
gulp.task('watch', function() {
	gulp.watch('source/app/**/*.js', ['jshint']);
	gulp.watch('source/styles/*.less', ['less']);
});

//gulp tasks
gulp.task('less', function() {
	return gulp.src('source/styles/index.less')
		.pipe(less())
		.pipe(concatCss('styles.css'))
		.pipe(gulp.dest('source/styles/'));
});

gulp.task('jshint', function() {
	return gulp.src('source/app/**/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
});

//TODO add injection

//gulp commands
gulp.task('default', ['watch']);