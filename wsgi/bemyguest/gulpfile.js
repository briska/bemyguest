var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');
var es2015 = require('babel-preset-es2015');
var react = require('babel-preset-react');
var sass = require('gulp-sass');
var path = require('path');
var del = require('del');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var fs = require('extfs');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
    del.sync('static/css/');
    del.sync('static/js/');
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('jsx', function () {
    return gulp.src('js/**/*.jsx')
    .pipe(babel({
        presets: [react, es2015]
    }))
    .on('error', handleError)
    .pipe(gulp.dest('static/js/'));
});

gulp.task('js', function () {
    return gulp.src('js/**/*.js')
    .pipe(babel({
        presets: [es2015]
    }))
    .on('error', handleError)
    .pipe(gulp.dest('static/js/'));
});

gulp.task('bundle', ['jsx', 'js'], function() {
    var bundler = browserify({
        entries: 'static/js/core/client.js',
        paths: ['node_modules','static/js/'],
        debug: true
    });
    
    return bundler.bundle()
        .on('error', handleError)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('static/js/core/'));
});

gulp.task('json', function () {
    return gulp.src('js/**/*.json')
        .pipe(gulp.dest('static/js/'));
});

gulp.task('scss', function () {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .on('error', handleError)
        .pipe(gulp.dest('static/css/'));
});

function deleteFile(file, oldRoot, newRoot, newExt) {
    var oldPath = path.relative(oldRoot, file);
    var newFileName = path.basename(oldPath, path.extname(oldPath)) + newExt;
    var newPath = path.resolve(newRoot, path.join(path.dirname(oldPath), newFileName));
    del.sync(newPath);
    var newDir = path.dirname(newPath);
    if (fs.isEmptySync(newDir)) del.sync(newDir);
}

gulp.task('watch', ['clean'], function() {
    gulp.start('bundle');
    gulp.start('json');
    gulp.start('scss');
    watch('js/**/*.{js,jsx}', batch((events, done) => {
        gulp.start('bundle', done);
    })).on('unlink', (file) => {deleteFile(file, 'js/', 'static/js/', '.js');});
    watch('js/**/*.json', batch((events, done) => {
        gulp.start('json', done);
    })).on('unlink', (file) => {deleteFile(file, 'js/', 'static/js/', '.json');});
    watch('scss/**/*.scss', batch((events, done) => {
        gulp.start('scss', done);
    })).on('unlink', (file) => {deleteFile(file, 'scss/', 'static/css/', '.css');});
});
