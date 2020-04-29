const request = require('request');
require('colors');

const removeScriptPath = '/-/script/v2/master/RemoveMedia';

module.exports = function (server, destinationPath, login, password) {
    const url = `${server}${removeScriptPath}?user=${login}&password=${password}&path=${destinationPath}&database=master`;
    return new Promise((resolve, reject) => {
        setTimeout(function () { resolve(); }, 200);
        request.get({
            url: url,
            agentOptions : {
                rejectUnauthorized :false
            }
        }, (err, httpResponse, body) => {
            if (err) {
                console.log(`Removing of '${destinationPath}' failed: ${err}`.red);
            } else if (httpResponse.statusCode !== 200) {
                console.log(`Removing of '${destinationPath}' failed`.red);
                console.log(`Status code: ${httpResponse.statusCode}, status message: ${httpResponse.statusMessage}`.red);
            } else {
                console.log(`Removing of '${destinationPath}' was successful!`.green);
            }
        });
    });
}