
global.rootPath = __dirname;

const { gulpTaskInit } = require('@sxa/celt');
const fileActionResolver = require('@sxa/celt/util/fileActionResolver').fileActionResolver;
const uploadScriban = require('@sxa/celt/util/requestChangeScriban');

//	Ensure process ends after all Gulp tasks are finished

const gulp = require("gulp");
const babel = require("gulp-babel");
const glob = require("glob");
const fs = require("fs");

const config = require(global.rootPath + '/gulp/config');
var runSequence = require('run-sequence').use(gulp);

gulpTaskInit();

gulp.task('transpileES', function () {
    var conf = config.es;
    return gulp.src(conf.path)
      .pipe(babel())
      .pipe(gulp.dest('scripts'));
});

// For a build we have to cover the following default "all-watch" gulp tasks:
// sass-watch, js-watch, es-watch, css-watch, img-watch, watch-source-sass, html-watch (only for creative exchange)
// and the additional watch task for TypeScript and Scriban
gulp.task('all-build', ['login'], function () {
  runSequence(
    //'transpileES', 
    //'jsOptimise', // creates pre-optimized-min.js

    'sprite-flag',
    'sassStyles',
    'sassComponents',
    'cssOptimise', // creates pre-optimized-min.css
    
    () => {
      fileActionResolver({ path: `${__dirname}/scripts/pre-optimized-min.js`, event: 'change'});
      fileActionResolver({ path: `${__dirname}/styles/pre-optimized-min.css`, event: 'change'});
      uploadScriban({ path: `${__dirname}/-/scriban/metadata.json`});
      glob(config.img.path, {ignore: 'images/flags/**/*'}, (err, files) => {
        if (err) done(err);
        files.map((entry) => { 
          if (fs.lstatSync(entry).isFile()) {
            fileActionResolver({ path: entry, event: 'change'}); 
          }
        });
      });
    }
  );
});