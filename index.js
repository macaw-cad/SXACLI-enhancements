global.rootPath = __dirname;

const {
  gulpTaskInit
} = require('@sxa/celt');
const fileActionResolver = require('@sxa/celt/util/fileActionResolver').fileActionResolver;
const uploadScriban = require('@sxa/celt/util/requestChangeScriban');

//	Ensure process ends after all Gulp tasks are finished

const gulp = require("gulp");
const watch = require('gulp-watch');
const bulkSass = require('gulp-sass-bulk-import');
const gulpReplace = require('gulp-replace');
const glob = require("glob");
const fs = require("fs");
const path = require("path");

const config = require(global.rootPath + '/gulp/config');

gulpTaskInit();

// Fix the wildcard imports (is not sass - handled by gulp-sass-bulk-import but does not work over multiple levels)
// Fix location of "base/.." folder - must be relative due to new build approach using webpack
gulp.task('fix-sass-for-webpack', function() {
  gulp
    .src('sass/*.scss')
    .pipe(bulkSass())
    // make @import path relative to sass folder
    .pipe(gulpReplace(path.join(__dirname, 'sass/').replace(/\\/g,'/'), ''))
    .pipe( gulp.dest('sass/') );

  gulp
    .src('sass/*/*.scss')
    .pipe(gulpReplace('"base/', '"../base/'))
    .pipe( gulp.dest('sass/') );
  
  gulp
    .src('sass/*/*/*.scss')
    .pipe(gulpReplace('"base/', '"../../base/'))
    .pipe( gulp.dest('sass/') );
});

// Watch scripts/pre-optimized-min.js and upload if changed - but don't remove if deleted
gulp.task('custom-js-watch', ['login'], () => {
  setTimeout(function () {
    console.log('Watching JS file scripts/pre-optimized-min.js started...'.green);
  }, 0);
  return watch('scripts/pre-optimized-min.js', {
    verbose: 0,
    delay: 500
  }, function (file) {
    if (file.event === 'add' || file.event === 'change') {
      fileActionResolver(file);
    }
  })
});

// Watch styles/pre-optimized-min.css and upload if changed - but don't remove if deleted
gulp.task('custom-css-watch', ['login'], () => {
  setTimeout(function () {
    console.log('Watching JS file styles/pre-optimized-min.css started...'.green);
  }, 0);
  return watch('styles/pre-optimized-min.css', {
    verbose: 0,
    delay: 500
  }, function (file) {
    if (file.event === 'add' || file.event === 'change') {
      fileActionResolver(file);
    }
  })
});

// sources/index.ts + included files (also sass) is watched by webpack
// Watch images and Scriban files and the generated scripts/pre-optimized-min.js and styles/pre-optimized-min.css
gulp.task('custom-all-watch', ['login'],
  function () {
    global.isWatching = true;

    // Upload images
    gulp.run('img-watch')
    
    // Upload Scriban files
    gulp.run('watch-scriban');

    // Watch scripts/pre-optimized-min.js and upload
    gulp.run('custom-js-watch')

    // Watch styles/pre-optimized-min.css and upload
    gulp.run('custom-css-watch')
  }
);

// Deploy all created artifacts to Sitecore:
// - scripts/pre-optimized-min.js
// - styles/pre-optimized-min.css
// - -/scriban/**/*.scriban
// - images/**/* - excluding the images/flags folder
gulp.task('deploy-to-sitecore', ['login'], function () {
  fileActionResolver({
    path: `${__dirname}/scripts/pre-optimized-min.js`,
    event: 'change'
  });

  if (fs.existsSync(`${__dirname}/scripts/pre-optimized-min.css`)) {
    throw Error("Don't include styling in component code files - include in sass/custom-components.scss");
  }

  fileActionResolver({
    path: `${__dirname}/styles/pre-optimized-min.css`,
    event: 'change'
  });

  uploadScriban({
    path: `${__dirname}/-/scriban/metadata.json`
  });

  glob(config.img.path, {
    ignore: 'images/flags/**/*'
  }, (err, files) => {
    if (err) done(err);
    files.map((entry) => {
      if (fs.lstatSync(entry).isFile()) {
        fileActionResolver({
          path: entry,
          event: 'change'
        });
      }
    });
  });
});