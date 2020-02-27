$ProxyPort = 8288
write-host "ARGS: $Args"
$env:https_proxy="http://localhost:$ProxyPort"
$env:http_proxy="http://localhost:$ProxyPort"
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
& "C:\Users\serge\AppData\Roaming\npm\sxa.cmd" $Args