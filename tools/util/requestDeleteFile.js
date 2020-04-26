const request = require('request');

const removeScriptPath = '/-/script/v2/master/RemoveMedia';

var exports = module.exports = function (path, server, dest, login, password) {
    const url = `${server}${removeScriptPath}?user=${login}&password=${password}&script=${dest}&sc_database=master&apiVersion=media&scriptDb=master`;
    setTimeout(function () {
        request.get({
            url: url,
            agentOptions : {
                rejectUnauthorized :false
            }
        }, (err, httpResponse, body) => {
            try {
                var response = JSON.parse(body);
                if (!response.result) {
                    console.log(`Removing of '${dest}' failed: ${response.Reason}`.red);
                } else {
                    console.log(`Removing of '${dest}' was successful!`.green);
                }
                if (err) {
                    console.log(`Removing of '${dest}' failed: ${err}`.red);
                }
            } catch (e) {
                console.log(`Removing of '${dest}' failed`.red);
                console.log(`Status code: ${httpResponse.statusCode}`.red);
                console.log(`Answer: ${httpResponse.body}`.red);
            }
        });
    }, 500)
}