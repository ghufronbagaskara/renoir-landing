$ErrorActionPreference = 'Stop'
$inputDeck = Join-Path $PSScriptRoot '.build/animated-v5.pptx'
$videoPath = Join-Path $PSScriptRoot 'output/contoh-animasi-v5.mp4'
$samplePath = Join-Path $PSScriptRoot '.build/motion-proof-v5.pptx'
if ((Test-Path -LiteralPath $videoPath) -or (Test-Path -LiteralPath $samplePath)) { throw 'Use new proof filenames' }
$wasRunning = @(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$application = New-Object -ComObject PowerPoint.Application
$deck = $null
try {
    $deck = $application.Presentations.Open($inputDeck, -1, 0, 0)
    for ($i = $deck.Slides.Count; $i -ge 1; $i--) {
        if ($i -notin @(1,5,6,14)) { $deck.Slides.Item($i).Delete() }
    }
    $deck.SlideShowSettings.ShowWithAnimation = -1
    $deck.SaveAs($samplePath,24,-1)
    $deck.CreateVideo($videoPath,$false,3,720,30,85)
    $deadline = [DateTime]::UtcNow.AddMinutes(5)
    do {
        Start-Sleep -Seconds 1
        $status = [int]$deck.CreateVideoStatus
        if ($status -eq 4) { throw 'PowerPoint video render failed' }
        if ([DateTime]::UtcNow -gt $deadline) { throw 'PowerPoint video render timed out' }
    } while ($status -ne 3)
    Get-Item -LiteralPath $videoPath | Select-Object Name,Length
}
finally {
    if ($null -ne $deck) { $deck.Saved=-1; $deck.Close(); [void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck) }
    if (-not $wasRunning) { $application.Quit() }
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($application)
}
