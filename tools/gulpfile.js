"use strict";

const fs = require('fs');
const path = require('path');
const through = require('through2');
const gulp = require('gulp');

const fileActionResolver = require('./util/fileActionResolver').fileActionResolver;

// We are in the tools subfolder, set rootPath to root where package.json lives
global.rootPath = path.resolve(path.join(__dirname, '..'));
const config = JSON.parse(fs.readFileSync(path.join(global.rootPath, 'config/config.json')));

const uploadFilesGlob = [
  '../Rendering Variants/**/*.scriban',
  '../Media Library/**/scripts/**/*',
  '../Media Library/**/styles/**/*',
  '../Media Library/**/fonts/**/*',
  '../Media Library/**/images/**/*',
];

const processFileInPipeline = () => {
  return through.obj({
    highWaterMark: 256
  }, (file, enc, cb, ) => {
    if (fs.lstatSync(file.path).isFile()) {
      // console.log(`Processing file '${file.path.replace(global.rootPath + '\\', '')}'`);
      fileActionResolver('change', file.path, config.server, config.user.login, config.user.password);
    }
    return cb(null, file);
  });
}

const fullDeploy = () => {
  return(
    gulp
      .src(uploadFilesGlob, {
        strict: true,
        silent: false
      })
      .pipe(processFileInPipeline())
  );
}

const watch = () => {
  gulp.watch(uploadFilesGlob, {
    delay: 500,
  }).on('all', (fileEvent, filePath) => {
    // console.log(`Changed file [${fileEvent}] '${filePath.replace(global.rootPath + '\\', '')}'`);
    fileActionResolver(fileEvent, filePath, config.server, config.user.login, config.user.password);
  });
}
// Exported tasks
exports.fullDeploy = fullDeploy;
exports.watch = watch;
