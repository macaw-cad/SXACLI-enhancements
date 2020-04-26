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

function isFileEmpty(file) {
    return ['change', 'add'].includes(file.event) && !file.stat.size;
}

module.exports = function (file, server, login, password) {
    if (isFileEmpty(file)) {
        console.log(`Scriban import for '${file.path}' failed because file is empty`.red);
        return;
    }
    const metadataFilePath = findUp.sync('metadata.json', { cwd: path.dirname(file.path) });
    if (!metadataFilePath) {
        console.log(`Scriban import for '${file.path}' failed because a parent folder should contain the file 'metadata.json' specifying the SXA site to upload to in the format {"siteId":"{F5AE341E-0C2E-44F8-8AD6-765DC311F57E}","database":"master"}`.red);
        return;
    }

    const variantRootPath = path.dirname(metadataFilePath);

    const relativeVariantRootPath = path.relative(global.rootPath, variantRootPath).replace(/\\/g,'/');
    if (!relativeVariantRootPath.endsWith('/-/scriban')) {
        console.log(`Scriban import for '${file.path}' failed because 'metadata.json', redering variants and .scriban files MUST be in a folder '.../-/scriban'`.red);
        return;
    }
    const url = `${server}${updateScribanPath}?user=${login}&password=${password}&path=${file.path}`;
    var formData = {
        streams: JSON.stringify(getPayload(variantRootPath)),
        metadata: JSON.stringify(JSON.parse(fs.readFileSync(metadataFilePath)))
    };

    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve(); }, 600);

        var a = request.post({
            url: url,
            formData: formData,
            agentOptions: {
                rejectUnauthorized: false
            }
        }, function (err, httpResponse, body) {
            if (err) {
                console.log(`Scriban import failed for Scriban files in the folder '${relativeVariantRootPath}': ${err}`.red);
            } else {
                try {
                    var response = JSON.parse(body);
                    if (!response.result) {
                        console.log(`Scriban import failed for Scriban files in the folder '${relativeVariantRootPath}': ${response.Reason}`.red);
                    } else {
                        console.log(`Scriban import was successful for Scriban files in the folder '${relativeVariantRootPath}'!`.green);
                    }
                    
                } catch (e) {
                    console.log(`Scriban import failed for Scriban files in the folder '${relativeVariantRootPath}'`.red);
                    console.log(`Status code: ${httpResponse.statusCode}`.red);
                    console.log(`Answer: ${httpResponse.body}`.red);
                }
            }
        });
    });
}