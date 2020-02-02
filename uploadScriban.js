global.rootPath = __dirname;
const { gulpTaskInit } = require('@sxa/celt');
const uploadScriban = require('@sxa/celt/util/requestChangeScriban');
gulpTaskInit();
uploadScriban({ path: `${__dirname}/-/scriban/metadata.json`});