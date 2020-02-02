global.rootPath = __dirname;
const { gulpTaskInit } = require('@sxa/celt');
const fileActionResolver = require('@sxa/celt/util/fileActionResolver').fileActionResolver;
const glob = require("glob");
const fs = require("fs");

gulpTaskInit();

var filesArgs = process.argv.slice(2);
console.log('Files to upload: ', filesArgs);
filesArgs.forEach((fileGlob) => {
    console.log('Uploading: ', fileGlob);
    glob(fileGlob, {ignore: 'images/flags/**/*'}, (err, files) => {
        if (err) done(err);
        files.map((entry) => { 
            if (fs.lstatSync(entry).isFile()) {
                fileActionResolver({ path: entry, event: 'change'}); 
            }
        });
    })
});
