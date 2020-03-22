global.rootPath = __dirname;

const {
  gulpTaskInit
} = require('@sxa/celt');
const fileActionResolver = require('@sxa/celt/util/fileActionResolver').fileActionResolver;
const uploadScriban = require('@sxa/celt/util/requestChangeScriban');

//	Ensure process ends after all Gulp tasks are finished

const gulp = require('gulp');
const watch = require('gulp-watch');
const bulkSass = require('gulp-sass-bulk-import');
const gulpReplace = require('gulp-replace');
const fs = require('fs');
const path = require('path');
const through = require('through2');

const config = require(global.rootPath + '/gulp/config');

const uploadFilesGlob = ['scripts/**/*', 'styles/**/*', 'fonts/**/*', 'images/**/*', '!images/flags/**/*'];

gulpTaskInit();

// Fix the wildcard imports of the sass copied from the Sitecore default theme provided in @sxa/Theme.
// The provided sass is not valid sass - top-level wildcard imports initially handled by gulp-sass-bulk-import
// but does not work over multiple levels.
// Fix location of "base/.." folder - must be relative due to new build approach using webpack
gulp.task('fix-defaulttheme-sass-for-webpack', function() {
  gulp
    .src('defaulttheme/sass/*.scss')
    .pipe(bulkSass())
    // make @import path relative to sass folder
    .pipe(gulpReplace(path.join(__dirname, 'defaulttheme/sass/').replace(/\\/g,'/'), './'))
    .pipe( gulp.dest('defaulttheme/sass/') );

  gulp
    .src('defaulttheme/sass/*/*.scss')
    .pipe(gulpReplace('"base/', '"../base/'))
    .pipe( gulp.dest('defaulttheme/sass/') );
  
  gulp
    .src('defaulttheme/sass/*/*/*.scss')
    .pipe(gulpReplace('"base/', '"../../base/'))
    .pipe( gulp.dest('defaulttheme/sass/') );
});

// Deploy/watch all created artifacts to Sitecore:
// - -/scriban/**/*.scriban
// - scripts/**/* (e.g. pre-optimized-min.js, ...)
// - styles/**/* (e.g. pre-optimized-min.css, ...)
// - fonts/**/* 
// - images/**/* - excluding the images/flags folder


// Watch images and Scriban files and the generated scripts/pre-optimized-min.js (+ other bundles) and styles/pre-optimized-min.css (+ other modules)

// Note that sources/index.ts + included files (also sass) is watched by webpack resulting in one or more files in scripts and styles folders
gulp.task('custom-all-watch', ['login'],
  function () {
    global.isWatching = true;

    // Upload Scriban files
    gulp.run('watch-scriban');

    // Watch other files
    gulp.watch(uploadFilesGlob, { verbose: 0, delay: 500 }, function (file) {
      processFile(file);
    });
  }
);

gulp.task('deploy-to-sitecore', ['login'], function () {
  uploadScriban({
    path: `${__dirname}/-/scriban/metadata.json`
  });

  gulp.src(uploadFilesGlob, { strict: true, silent: false })
    .pipe(processFileInPipeline())
});

const processFileInPipeline = () => {
  return through.obj({ highWaterMark: 256 }, (file, enc, cb, ) => {
    processFile(file);
    return cb(null, file);
  });
}

const processFile = (file) => {
  if (fs.lstatSync(file.path).isFile()) {
    fileActionResolver({
      path: file.path,
      event: 'change'
    });
  }
} 