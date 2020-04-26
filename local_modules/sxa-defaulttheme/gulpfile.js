const gulp = require('gulp');
const bulkSass = require('gulp-sass-bulk-import');
const gulpReplace = require('gulp-replace');
const path = require('path');
const spritesmith = require('gulp.spritesmith');

// Fix the wildcard imports of the sass copied from the Sitecore default theme provided in @sxa/Theme.
// The provided sass is not valid sass - top-level wildcard imports initially handled by gulp-sass-bulk-import
// but does not work over multiple levels. Additional files with wilcard import:
// - sass/styles/common/link-button.scss
// Fix location of "base/.." folder - must be relative due to new build approach using webpack
gulp.task('fix-defaulttheme-sass-for-webpack', function (done) {
    
    gulp
        .src('sass/*.scss')
        .pipe(bulkSass())
        // make @import path relative to sass folder
        .pipe(gulpReplace(path.join(__dirname, '/sass/').replace(/\\/g, '/'), './'))
        .pipe(gulp.dest('sass/'));
    
    gulp
        .src('sass/styles/common/link-button.scss')
        .pipe(gulpReplace('@import "../../base/links/*"','@import "../../base/links/_link-button.scss"'))
        .pipe(gulp.dest('sass/'));

    gulp
        .src('sass/*/*.scss')
        .pipe(gulpReplace('"base/', '"../base/'))
        .pipe(gulp.dest('sass/'));

    gulp
        .src('sass/*/*/*.scss')
        .pipe(gulpReplace('"base/', '"../../base/'))
        .pipe(gulp.dest('sass/'));

    // sass/variants/*/*.scss: direct reference to @import "abstracts/xyz",
    // instead of ../../abstracts/xyz
    gulp
        .src('sass/variants/*/*.scss')
        .pipe(gulpReplace('"abstracts', '"../../abstracts'))
        .pipe(gulp.dest('sass/variants/'));

    done();

});

gulp.task('sprite-flag', function(done) {
    let spriteData = gulp.src('images/flags/*.png').pipe(spritesmith({
        imgName: 'sprite-flag.png',
        cssName: '_sprite-flag.scss',
        imgPath: 'images/sprite-flag.png',
        cssFormat: 'scss',
        padding: 10,
        algorithm: 'top-down',
        cssOpts: {
            cssSelector: function (sprite) {
                return '.flags-' + sprite.name;
            }
        },
        cssVarMap: function (sprite) {
            sprite.name = 'flags-' + sprite.name;
        }
    }));
    spriteData.img.pipe(gulp.dest('images'));
    spriteData.css.pipe(gulp.dest('sass/base/sprites'));
    done();
});