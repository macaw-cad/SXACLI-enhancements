const fs = require('fs');
const path = require('path');
const through = require('through2');
const gulp = require('gulp');

const fileActionResolver = require('./util/fileActionResolver').fileActionResolver;

// We are in the tools subfolder, set rootPath to root where package.json lives
global.rootPath = path.resolve(path.join(__dirname, '..'));
const config = JSON.parse(fs.readFileSync(path.join(global.rootPath + 'config/config.json')));

const uploadFilesGlob = [
  'Rendering Variants/**/*.scriban',
  'Media Library/**/scripts/**/*',
  'Media Library/**/styles/**/*',
  'Media Library/**/fonts/**/*',
  'Media Library/**/images/**/*',
  '!Media Library/**/images/flags/**/*'
];

gulp.task('watch', function () {
  gulp.watch(uploadFilesGlob, {
    verbose: 0,
    delay: 500
  }, function (file) {
    processFile(file);
  });
});

gulp.task('deploy-to-sitecore', function (done) {
  gulp.src(uploadFilesGlob, {
      strict: true,
      silent: false
    })
    .pipe(processFileInPipeline());
  done();
});

const processFileInPipeline = () => {
  return through.obj({
    highWaterMark: 256
  }, (file, enc, cb, ) => {
    processFile({
      path: file.path,
      event: 'change'
    });
    return cb(null, file);
  });
}

const processFile = (file) => {
  if (fs.lstatSync(file.path).isFile()) {
    console.log(`Processing file '${file.path.replace(path.resolve(path.join(__dirname, '..')) + '\\', '')}'`);
    fileActionResolver(file, config.server, config.user.login, config.user.password);
  }
}