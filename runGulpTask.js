
global.rootPath = __dirname;

const { gulpTaskInit } = require('@sxa/celt');
const gulp = require("gulp");
gulpTaskInit();
var taskArgs = process.argv.slice(2);
console.log('Gulp tasks: ', taskArgs);

if (taskArgs.length == 0) {
    console.log('Specify Gulp task to run')
} else {
    gulp.start(taskArgs);
}