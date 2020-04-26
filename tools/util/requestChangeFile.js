const fs = require('fs');
const request = require('request');
require('colors');

const uploadScriptPath = '/sitecore modules/PowerShell/Services/RemoteScriptCall.ashx';

module.exports = function (path, server, dest, login, password) {
    const url = `${server}${uploadScriptPath}?user=${login}&password=${password}&script=${dest}&sc_database=master&apiVersion=media&scriptDb=master`;
    const formData = { file: fs.createReadStream(path) };

    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve(); }, 600);
        request.post({
            url: url,
            formData: formData,
            agentOptions : {
                rejectUnauthorized :false
            }
        }, (err, httpResponse, body) => {
            resolve();
            if (err) {
                console.log(`Upload of '${dest}' failed: ${err}`.red);
            } else if (httpResponse.statusCode !== 200) {
                console.log(`Upload of '${dest}' failed`.red);
                console.log(`Status code: ${httpResponse.statusCode}`.red);
                console.log(`Answer: ${httpResponse.body}`.red);
            } else {
                console.log(`Upload of '${dest}' was successful!`.green);
            }
        });
    });
}