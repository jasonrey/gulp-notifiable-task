'use strict';

let gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel');

require('./index.js');

gulp.notifiableTask('default', ['babel', 'sass'], function(done) {
    setTimeout(function() {
        done();
    }, 2000);
});

gulp.notifiableTask('sass', function() {
    return gulp.src('./testin/test.sass')
        .pipe(sass())
        .pipe(gulp.dest('./testout'));
});

gulp.notifiableTask('babel', function() {
    return gulp.src('./testin/test.es6')
        .pipe(babel())
        .pipe(gulp.dest('./testout'));
});

gulp.task('watch', ['watch:sass', 'watch:babel']);

gulp.task('watch:sass', function() {
    return gulp.watch('./testin/*.sass', ['sass']);
});

gulp.task('watch:babel', function() {
    return gulp.watch('./testin/*.es6', ['babel']);
});
