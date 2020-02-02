
global.rootPath = __dirname;

const { gulpTaskInit } = require('@sxa/celt');
const fileActionResolver = require('@sxa/celt/util/fileActionResolver').fileActionResolver;
const uploadScriban = require('@sxa/celt/util/requestChangeScriban');

//	Ensure process ends after all Gulp tasks are finished

const gulp = require("gulp");
const watch = require('gulp-watch');
const glob = require("glob");
const fs = require("fs");

const config = require(global.rootPath + '/gulp/config');
var runSequence = require('run-sequence').use(gulp);

gulpTaskInit();

// Watch scrips/pre-optimized-min.js and upload if changed
gulp.task('custom-js-watch', ['login'], () => {
  var conf = config.js;
  setTimeout(function () {
      console.log('Watching JS file scripts/pre-optimized-min.js started...'.green);
  }, 0);
  return watch('scripts/pre-optimized-min.js', { verbose: 0 }, function (file) {
      var stream = gulp.src(file.path);
      fileActionResolver(file);
      return stream;
  })
});

// Watch sass, images and Scriban files - sources folder is watched by webpack
gulp.task('custom-all-watch', ['login'],
  function () {
      global.isWatching = true;

      // Transpiles the code in the sass folder to css in the styles folder
      // the Sitecore SXA way: styles, variants, component-*
      // TODO:
      // Let webpack do the styling transpilation.
      // Must be solved by getting sass-bulk-import-loader working.
      // Other files (main, overlay, privacy-warning and custom components) will then be included
      // from sources/index.scss 
      gulp.run('sass-watch');
      gulp.run('css-watch')

      // Upload images
      gulp.run('img-watch')

      gulp.run('custom-js-watch')
      
      // Upload Scriban files
      gulp.run('watch-scriban');
  }
);

// 
gulp.task('build-css', ['login'], 
  function () {
    runSequence(
      'sprite-flag', 
      ['sassStyles', 'sassComponents'],
      'cssOptimise'
    );
  }
);

// Deploy all created artifacts to Sitecore:
// - scripts/pre-optimized-min.js
// - styles/pre-optimized-min.css
// - -/scriban/**.*.scriban
// - images/**/* - excluding the images/flags folder
gulp.task('deploy-to-sitecore', ['login'], function () {
  fileActionResolver({ path: `${__dirname}/scripts/pre-optimized-min.js`, event: 'change'});

  if (fs.existsSync(`${__dirname}/scripts/pre-optimized-min.css`)) {
    throw Error("Don't include styling in component code files - include in sass/custom-components.scss");
  } 

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
});