#  Publish theme to Sitecore
param(
    [string]$itemPath = "/sitecore/content/SergeTenant/SergeSxaSite/Data/Carousels/HabitatHome/Slide1"
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

$serverConfigResult = Get-Content -Path gulp\serverConfig.json | ConvertFrom-Json
$projectPath = $serverConfigResult.serverOptions.projectPath
$themePath = $serverConfigResult.serverOptions.themePath
$fullThemePath = "master:\Media Library$projectPath$themePath"

Write-Output "Username: $username"
Write-Output "Password: $password"
Write-Output "ConnectionUri: $server"
Write-Output "Theme path: $fullThemePath"
Write-Output "Get item fields of '$itemPath'..."
Import-Module -Name SPE 
$session = New-ScriptSession -Username $username -Password $password -ConnectionUri $server
Invoke-RemoteScript -Session $session -ScriptBlock { 
    Get-Item $Using:itemPath | Get-ItemField -IncludeStandardFields -ReturnType Field -Name "*" | ft Name, DisplayName, SectionDisplayName, Description -auto
}
Stop-ScriptSession -Session $session
