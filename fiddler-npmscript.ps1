param(
    [string]$NpmScript = "watch", 
    [int]$ProxyPort = 8888
)

$env:https_proxy="http://localhost:$ProxyPort"
$env:http_proxy="http://localhost:$ProxyPort"
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
npm run $NpmScript