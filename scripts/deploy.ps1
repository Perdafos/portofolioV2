param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,

  [Parameter(Mandatory = $false)]
  [string]$Port = "22",

  [Parameter(Mandatory = $true)]
  [string]$TargetDir
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path "dist")) {
  throw "Folder dist tidak ditemukan. Jalankan build terlebih dahulu."
}

$buildNumber = if ($env:BUILD_NUMBER) { $env:BUILD_NUMBER } else { "local" }
$archiveName = "dist-$buildNumber.zip"

if (Test-Path $archiveName) {
  Remove-Item $archiveName -Force
}

Compress-Archive -Path "dist\*" -DestinationPath $archiveName -Force

$remoteArchive = "/tmp/$archiveName"

Write-Host "Uploading artifact to $HostName`:$remoteArchive"
scp -P $Port -o StrictHostKeyChecking=no $archiveName "$HostName`:$remoteArchive"

Write-Host "Extracting artifact to $TargetDir"
ssh -p $Port -o StrictHostKeyChecking=no $HostName "mkdir -p '$TargetDir' && rm -rf '$TargetDir'/* && unzip -oq '$remoteArchive' -d '$TargetDir' && rm -f '$remoteArchive'"

Remove-Item $archiveName -Force
Write-Host "Deploy selesai ke $HostName`:$TargetDir"