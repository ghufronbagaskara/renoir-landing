param(
    [string]$InputDeck = (Join-Path $PSScriptRoot '.build/candidate.pptx'),
    [string]$OutputDeck = (Join-Path $PSScriptRoot '.build/animated-v5.pptx')
)

$ErrorActionPreference = 'Stop'
$InputDeck = (Resolve-Path -LiteralPath $InputDeck).Path
$OutputDeck = [IO.Path]::GetFullPath($OutputDeck)
if ($InputDeck -eq $OutputDeck) { throw 'Input and output must be different files' }
if (Test-Path -LiteralPath $OutputDeck) { throw 'Use a new output filename' }
$powerPointWasRunning = @(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$application = $null
$deck = $null
$animationCount = 0
$registeredFonts = @()
$previewDir = Join-Path $PSScriptRoot '.build/powerpoint-preview-v5'
New-Item -ItemType Directory -Path $previewDir -Force | Out-Null
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class KatalhysFontSession {
    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)] public static extern int AddFontResourceEx(string path, uint flags, System.IntPtr reserved);
    [DllImport("gdi32.dll", CharSet = CharSet.Unicode)] public static extern bool RemoveFontResourceEx(string path, uint flags, System.IntPtr reserved);
}
'@

try {
    # Temporary session registration lets PowerPoint render the existing brand fonts.
    foreach ($font in Get-ChildItem -LiteralPath (Join-Path $PSScriptRoot '.build/fonts') -Filter '*.ttf' -File) {
        if ([KatalhysFontSession]::AddFontResourceEx($font.FullName, 0, [IntPtr]::Zero) -gt 0) {
            $registeredFonts += $font.FullName
        }
    }
    $application = New-Object -ComObject PowerPoint.Application
    $deck = $application.Presentations.Open($InputDeck, 0, 0, 0)
    if ($deck.Slides.Count -ne 37) { throw "Expected 37 slides; got $($deck.Slides.Count)" }
    $deck.SlideShowSettings.ShowWithAnimation = -1
    $deck.SlideShowSettings.AdvanceMode = 1

    foreach ($slide in $deck.Slides) {
        $slide.SlideShowTransition.EntryEffect = 3853 # Push Left
        $slide.SlideShowTransition.Duration = 0.85
        $slide.SlideShowTransition.AdvanceOnClick = -1
        $slide.SlideShowTransition.AdvanceOnTime = 0
        $sequence = $slide.TimeLine.MainSequence
        while ($sequence.Count -gt 0) { $sequence.Item(1).Delete() }
        $delay = 0.1
        foreach ($shape in $slide.Shapes) {
            # Keep the header logo and reading text still; animate the supporting images.
            if ($shape.Type -eq 13 -and $shape.Top -gt 65 -and $shape.Width -gt 100) {
                $effectId = if ($shape.AlternativeText -like 'Ilustrasi konseptual*') { 48 } else { 10 }
                $effect = $sequence.AddEffect($shape, $effectId, 0, 2)
                $effect.Timing.Duration = 0.75
                $effect.Timing.TriggerDelayTime = $delay
                $delay = [Math]::Min(0.55, $delay + 0.08)
                $animationCount++
            }
        }
        $png = Join-Path $previewDir ('slide-{0:d2}.png' -f [int]$slide.SlideIndex)
        $slide.Export($png, 'PNG', 1280, 720)
    }

    if ($animationCount -lt 30) { throw "Too few image animations: $animationCount" }
    $deck.SaveAs($OutputDeck, 24, -1)
    $deck.SaveAs((Join-Path $PSScriptRoot 'output/katalhys-pitch-id-v5.pdf'), 32)
    $deck.Close()
    $deck = $application.Presentations.Open($OutputDeck, -1, 0, 0)
    $reopenedAnimations = 0
    foreach ($slide in $deck.Slides) {
        $expectedEffect = 3853
        if ($slide.SlideShowTransition.EntryEffect -ne $expectedEffect) { throw "Missing transition on slide $($slide.SlideIndex)" }
        if ($slide.SlideShowTransition.AdvanceOnTime -ne 0) { throw 'Unexpected automatic slide advance' }
        $reopenedAnimations += $slide.TimeLine.MainSequence.Count
    }
    if ($reopenedAnimations -ne $animationCount) { throw 'Animation count changed after reopening' }
    if ($deck.SlideShowSettings.ShowWithAnimation -ne -1) { throw 'Slide Show animations disabled' }
    [PSCustomObject]@{ Slides = $deck.Slides.Count; Transitions = $deck.Slides.Count; ImageAnimations = $reopenedAnimations; PowerPointVersion = $application.Version; Output = $OutputDeck } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $PSScriptRoot '.build/powerpoint-check.json')
    Get-Content -LiteralPath (Join-Path $PSScriptRoot '.build/powerpoint-check.json')
}
finally {
    if ($null -ne $deck) { $deck.Close() }
    if ($null -ne $application -and -not $powerPointWasRunning) { $application.Quit() }
    if ($null -ne $deck) { [Runtime.InteropServices.Marshal]::ReleaseComObject($deck) | Out-Null }
    if ($null -ne $application) { [Runtime.InteropServices.Marshal]::ReleaseComObject($application) | Out-Null }
    foreach ($font in $registeredFonts) { [KatalhysFontSession]::RemoveFontResourceEx($font, 0, [IntPtr]::Zero) | Out-Null }
}
