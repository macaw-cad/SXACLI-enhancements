#  Create the file -/scriban/metadata.json file in the format:
# {"siteId":"{F5AE341E-0C2E-44F8-8AD6-765DC311F57E}","database":"master"}
# based on the path to the site, e.g. /sitecore/content/SergeTenant/SergeSxaSite
param (
    [Parameter(Mandatory)]
    [string]$sitePath

)
Set-Location -Path $PSScriptRoot

$configParseResult = select-string -path gulp\config.js -pattern "user: { login: '(.*)', password: '(.*)' }"
if ($configParseResult.Matches.Groups.Length -ne 3) {
    Write-Error "Expected file gulp\config.js to contain a line in the format: user: { login: 'sitecore\\admin', password: 'b' }"
    Exit
}
$username = $configParseResult.Matches.Groups[1].Value.Replace('\\', '\')
$password = $configParseResult.Matches.Groups[2].Value

if ($username -eq '' -or $password -eq '') {
    Write-Error "Expected file gulp\config.js to contain a line in the format: user: { login: 'sitecore\\admin', password: 'b' }, login or password is empty."
    Exit
}

$configParseResult = select-string -path gulp\config.js -pattern "server: '(.*)'"
if ($configParseResult.Matches.Groups.Length -ne 2) {
    Write-Error "Expected file gulp\config.js to contain a line in the format: server: 'https://myserver.dev.local/'"
    Exit
}
$server = $configParseResult.Matches.Groups[1].Value
if ($server -eq '') {
    Write-Error "Expected file gulp\config.js to contain a line in the format: server: 'https://myserver.dev.local/', server is empty."
    Exit
}

Write-Output "Username: $username"
Write-Output "Password: $password"
Write-Output "ConnectionUri: $server"
Write-Output "Site path: $sitePath"
Write-Output "Writing file -\scriban\metadata.json..."
Import-Module -Name SPE 
$session = New-ScriptSession -Username $username -Password $password -ConnectionUri $server
$siteItem = Invoke-RemoteScript -Session $session -ScriptBlock { 
    Get-Item -Path $Using:sitePath
}
Stop-ScriptSession -Session $session
$metadataJson = "`{`"siteId`":`"$($siteItem.Id)`",`"database`":`"master`"`}"
Write-Output $metadataJson
Set-Content -Path "-\scriban\metadata.json" -Value $metadataJson -Force