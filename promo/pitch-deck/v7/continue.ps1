$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
$build=Join-Path $root '.build/v7'
$manifest=Get-Content -Raw (Join-Path $build 'manifest.json') | ConvertFrom-Json
$candidate=Join-Path $build 'candidate.pptx'
$pdf=Join-Path $root 'output/katalhys-pitch-id-v7.pdf'
if((Test-Path $candidate) -or (Test-Path $pdf)){throw 'Use new filenames for another revision'}
if((Get-FileHash $manifest.base -Algorithm SHA256).Hash.ToLowerInvariant() -ne $manifest.baseHash){throw 'The current v6 baseline changed'}
Copy-Item -LiteralPath $manifest.base -Destination $candidate
$preview=Join-Path $build 'powerpoint-preview'
New-Item -ItemType Directory -Force $preview | Out-Null
$wasRunning=@(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$app=$null;$deck=$null;$fonts=@()
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class KatalhysV7Fonts {
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] public static extern int AddFontResourceEx(string path,uint flags,System.IntPtr reserved);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] public static extern bool RemoveFontResourceEx(string path,uint flags,System.IntPtr reserved);
}
'@
function Find-Text($shape,$number){
 if($shape.Type -eq 6){foreach($child in $shape.GroupItems){Find-Text $child $number}}
 elseif($shape.HasTextFrame -eq -1 -and $shape.TextFrame.HasText -eq -1){
  [PSCustomObject]@{slide=$number;name=$shape.Name;text=$shape.TextFrame.TextRange.Text;left=[double]$shape.Left;top=[double]$shape.Top;width=[double]$shape.Width;height=[double]$shape.Height;boundHeight=[double]$shape.TextFrame.TextRange.BoundHeight}
 }
}
try{
 foreach($f in Get-ChildItem (Join-Path $root '.build/fonts') -Filter '*.ttf'){
  if([KatalhysV7Fonts]::AddFontResourceEx($f.FullName,0,[IntPtr]::Zero) -gt 0){$fonts+=$f.FullName}
 }
 $app=New-Object -ComObject PowerPoint.Application
 $deck=$app.Presentations.Open($candidate,0,0,0)
 if($deck.Slides.Count -ne 39){throw 'Expected the manually edited 39-slide v6'}
 $ids=@($deck.Slides | ForEach-Object {$_.SlideID})
 if($deck.Slides.InsertFromFile((Join-Path $build 'addition.pptx'),39,1,1) -ne 1){throw 'Appendix import failed'}
 $slide=$deck.Slides.Item(40)
 foreach($shape in $slide.Shapes){
  if($shape.Name -eq 'Module HTML link'){$shape.ActionSettings.Item(1).Hyperlink.Address='sales-playbook/index.html'}
  if($shape.Name -eq 'Module PDF link'){$shape.ActionSettings.Item(1).Hyperlink.Address='sales-playbook/modul-sales.pdf'}
 }
 $slide.SlideShowTransition.EntryEffect=3849
 $slide.SlideShowTransition.Duration=.65
 $slide.SlideShowTransition.AdvanceOnClick=-1
 $slide.SlideShowTransition.AdvanceOnTime=0
 $deck.SlideShowSettings.ShowWithAnimation=-1
 $deck.SlideShowSettings.AdvanceMode=1
 $deck.SaveAs($candidate,24,-1);$deck.Close();$deck=$null
 $python=Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
 & $python (Join-Path $PSScriptRoot 'group.py') $candidate
 if($LASTEXITCODE -ne 0){throw 'Appendix grouping failed'}
 $deck=$app.Presentations.Open($candidate,0,0,0)
 $slide=$deck.Slides.Item(40)
 $effect=$slide.TimeLine.MainSequence.AddEffect($slide.Shapes.Item(1),10,0,2)
 $effect.Timing.Duration=.55;$effect.Timing.TriggerType=2;$effect.Timing.TriggerDelayTime=0
 $text=@();$receipt=@()
 foreach($slide in $deck.Slides){
  $number=[int]$slide.SlideIndex
  if($slide.Shapes.Count -ne 1 -or $slide.Shapes.Item(1).Type -ne 6){throw "Slide $number is not one editable page group"}
  if($slide.TimeLine.MainSequence.Count -ne 1){throw "Slide $number has multiple animation effects"}
  $effect=$slide.TimeLine.MainSequence.Item(1)
  if($effect.Timing.TriggerType -ne 2 -or $effect.Timing.TriggerDelayTime -ne 0){throw "Slide $number needs another animation click"}
  if($slide.SlideShowTransition.AdvanceOnTime -ne 0){throw "Slide $number advances automatically"}
  $text+=@(Find-Text $slide.Shapes.Item(1) $number)
  $slide.Export((Join-Path $preview ('slide-{0:d2}.png' -f $number)),'PNG',1280,720)
  $receipt+=[PSCustomObject]@{slide=$number;id=$slide.SlideID;effects=1;trigger='With Previous';delay=0;duration=$effect.Timing.Duration;transition=$slide.SlideShowTransition.EntryEffect}
  if($number%10 -eq 0){Write-Output "Rendered $number/40"}
 }
 foreach($id in $ids){[void]$deck.Slides.FindBySlideID($id)}
 $deck.SaveAs($candidate,24,-1);$deck.SaveAs($pdf,32)
 $text | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $build 'native-text.json') -Encoding utf8
 [PSCustomObject]@{slides=40;mainSlides=30;appendixSlides=10;seconds=1069;powerPointVersion=$app.Version;originalSlideIds=$ids;pages=$receipt} | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $build 'native-check.json') -Encoding utf8
 if((Get-FileHash $manifest.base -Algorithm SHA256).Hash.ToLowerInvariant() -ne $manifest.baseHash){throw 'Source changed'}
 Write-Output 'Preserved current v6 and exported 40-slide v7 candidate and PDF'
}
finally{
 if($null -ne $deck){$deck.Close();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck)}
 if($null -ne $app){if(-not $wasRunning){$app.Quit()};[void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)}
 foreach($f in $fonts){[void][KatalhysV7Fonts]::RemoveFontResourceEx($f,0,[IntPtr]::Zero)}
}
