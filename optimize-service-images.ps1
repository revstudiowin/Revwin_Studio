Add-Type -AssemblyName System.Drawing
$assetRoot = Join-Path $PSScriptRoot 'dist/assets'
$sourceRoot = Join-Path $PSScriptRoot 'output/service-art'
New-Item -ItemType Directory -Path $sourceRoot -Force | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
foreach ($service in @('marketing','websites','software','automation','creative','strategy')) {
    $source = Join-Path $assetRoot "service-$service.png"
    if (!(Test-Path -LiteralPath $source)) { continue }
    $image = [System.Drawing.Image]::FromFile($source)
    $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]85)
    try { $image.Save((Join-Path $assetRoot "service-$service.jpg"), $encoder, $parameters) }
    finally { $parameters.Dispose(); $image.Dispose() }
    Move-Item -LiteralPath $source -Destination (Join-Path $sourceRoot "service-$service.png") -Force
}
