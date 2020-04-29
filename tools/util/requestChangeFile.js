const fs = require('fs');
const request = require('request');
require('colors');

const uploadScriptPath = '/sitecore modules/PowerShell/Services/RemoteScriptCall.ashx';

module.exports = function (filePath, server, destinationPath, login, password) {
    const url = `${server}${uploadScriptPath}?user=${login}&password=${password}&script=${destinationPath}&sc_database=master&apiVersion=media&scriptDb=master`;
    const formData = { file: fs.createReadStream(filePath) };

    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve(); }, 200);
        request.post({
            url: url,
            formData: formData,
            agentOptions : {
                rejectUnauthorized :false
            }
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(`Upload of '${destinationPath}' failed: ${err}`.red);
            } else if (httpResponse.statusCode !== 200) {
                console.log(`Upload of '${destinationPath}' failed`.red);
                console.log(`Status code: ${httpResponse.statusCode}, status message: ${httpResponse.statusMessage}`.red);

            } else {
                console.log(`Upload of '${destinationPath}' was successful!`.green);
            }
        });
    });
}