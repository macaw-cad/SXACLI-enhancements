const fs = require('fs');
const path = require('path');
const request = require('request');
const findUp = require('find-up');
require('colors');

const updateScribanPath = '/-/script/v2/master/ChangeScriban';

function scribanFileFilter(name) {
    return /(\.(scriban)$)/i.test(name);
};

var getScribanFiles = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getScribanFiles(file));
        } else {
            if (scribanFileFilter(file)) {
                results.push(file);
            }
        }
    });
    return results;
}

function getPayload(variantRootPath) {
    var streams = []
    getScribanFiles(variantRootPath).forEach((scribanFile) => {
        var content = fs.readFileSync(scribanFile, 'utf8');
        var b = Buffer.from(content, 'utf-8');
        var obj = {
            path: scribanFile.replace(/\\/g, '/'),
            content: b.toString('base64')
        };
        streams.push(obj);
    });
    return streams;
}

function isFileEmpty(filePath) {
    return fs.statSync(filePath).size === 0;
}

module.exports = function (filePath, server, login, password) {
    if (isFileEmpty(filePath)) {
        console.log(`Scriban import for '${filePath}' failed because file is empty`.red);
        return;
    }
    const metadataFilePath = findUp.sync('metadata.json', { cwd: path.dirname(filePath) });
    if (!metadataFilePath) {
        console.log(`Scriban import for '${filePath}' failed because a parent folder should contain the file 'metadata.json' specifying the SXA site to upload to in the format {"siteId":"{F5AE341E-0C2E-44F8-8AD6-765DC311F57E}","database":"master"}`.red);
        return;
    }

    const variantRootPath = path.dirname(metadataFilePath);

    const relativeVariantRootPath = path.relative(global.rootPath, variantRootPath).replace(/\\/g,'/');
    if (!relativeVariantRootPath.endsWith('/-/scriban')) {
        console.log(`Scriban import for '${filePath.path}' failed because 'metadata.json', redering variants and .scriban files MUST be in a folder '.../-/scriban'`.red);
        return;
    }
    const url = `${server}${updateScribanPath}?user=${login}&password=${password}&path=${filePath.path}`;
    var formData = {
        streams: JSON.stringify(getPayload(variantRootPath)),
        metadata: JSON.stringify(JSON.parse(fs.readFileSync(metadataFilePath)))
    };

    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve(); }, 200);

        var a = request.post({
            url: url,
            formData: formData,
            agentOptions: {
                rejectUnauthorized: false
            }
        }, function (err, httpResponse, body) {
            if (err) {
                console.log(`Scriban import failed for Scriban files in the folder '${relativeVariantRootPath}': ${err}`.red);
            } else if (httpResponse.statusCode !== 200) {
                console.log(`Scriban import failed for Scriban files in the folder '${relativeVariantRootPath}'`.red);
                console.log(`Status code: ${httpResponse.statusCode}, status message: ${httpResponse.statusMessage}`.red);
            } else {
                console.log(`Scriban import was successful for Scriban files in the folder '${relativeVariantRootPath}'!`.green);
            }
        });
    });
}