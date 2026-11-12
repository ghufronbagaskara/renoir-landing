param([string]$Contact = '')
$ErrorActionPreference='Stop'
$deckRoot=Split-Path -Parent $PSScriptRoot
$build=Join-Path $deckRoot '.build/v6'
$manifest=Get-Content -LiteralPath (Join-Path $build 'manifest.json') -Raw | ConvertFrom-Json
$candidate=Join-Path $build 'enhanced-v6.pptx'
$pdf=Join-Path $deckRoot 'output/katalhys-pitch-id-v6.pdf'
$preview=Join-Path $build 'powerpoint-preview'
if ((Test-Path -LiteralPath $candidate) -or (Test-Path -LiteralPath $pdf)) { throw 'Use fresh v6 build/output filenames' }
$baseHash=(Get-FileHash -LiteralPath $manifest.base -Algorithm SHA256).Hash.ToLowerInvariant()
if ($baseHash -ne $manifest.baseSha256) { throw 'The approved v5 baseline has changed' }
New-Item -ItemType Directory -Force $preview | Out-Null
# Copy the actual approved file; edits below preserve every original slide identity.
Copy-Item -LiteralPath $manifest.base -Destination $candidate
$wasRunning=@(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$app=$null
$deck=$null
$registered=@()
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System.Runtime.InteropServices;
public static class KatalhysV6Fonts {
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] public static extern int AddFontResourceEx(string path,uint flags,System.IntPtr reserved);
 [DllImport("gdi32.dll",CharSet=CharSet.Unicode)] public static extern bool RemoveFontResourceEx(string path,uint flags,System.IntPtr reserved);
}
'@
function RGB([string]$hex) {
 $hex=$hex.TrimStart('#')
 return [Convert]::ToInt32($hex.Substring(0,2),16)+256*[Convert]::ToInt32($hex.Substring(2,2),16)+65536*[Convert]::ToInt32($hex.Substring(4,2),16)
}
function Add-Text($slide,[string]$value,$x,$y,$w,$h,$size,[string]$color,[bool]$bold) {
 $shape=$slide.Shapes.AddTextbox(1,$x*.75,$y*.75,$w*.75,$h*.75)
 $shape.Name='V6 text '+$shape.Id
 $shape.TextFrame.MarginLeft=0;$shape.TextFrame.MarginRight=0;$shape.TextFrame.MarginTop=0;$shape.TextFrame.MarginBottom=0
 $shape.TextFrame.AutoSize=0;$shape.TextFrame.WordWrap=-1
 $range=$shape.TextFrame.TextRange
 $range.Text=$value
 $range.Font.Name=if($bold){'General Sans'}else{'Inter'}
 $range.Font.Size=$size*.75
 $range.Font.Bold=if($bold){-1}else{0}
 $range.Font.Color.RGB=(RGB $color)
 $range.ParagraphFormat.SpaceBefore=0;$range.ParagraphFormat.SpaceAfter=0
 $range.ParagraphFormat.LineRuleWithin=-1;$range.ParagraphFormat.SpaceWithin=1.08
 return $shape
}
function Add-Image($slide,[string]$src,$x,$y,$w,$h,[string]$alternative='Layar proyek asli; data simulasi untuk aplikasi internal') {
 $bitmap=[Drawing.Image]::FromFile($src)
 try {$ratio=[double]$bitmap.Width/$bitmap.Height}finally{$bitmap.Dispose()}
 $iw=$w;$ih=$w/$ratio
 if($ih -gt $h){$ih=$h;$iw=$h*$ratio}
 $shape=$slide.Shapes.AddPicture($src,0,-1,($x+($w-$iw)/2)*.75,($y+($h-$ih)/2)*.75,$iw*.75,$ih*.75)
 $shape.Name='V6 proof '+$shape.Id;$shape.AlternativeText=$alternative
 return $shape
}
function Add-Svg($slide,$asset,$x,$y,$w,$h,[string]$alternative) {
 try {$shape=$slide.Shapes.AddPicture([string]$asset.svg,0,-1,$x*.75,$y*.75,$w*.75,$h*.75)}
 catch {$shape=$slide.Shapes.AddPicture([string]$asset.png,0,-1,$x*.75,$y*.75,$w*.75,$h*.75)}
 $shape.Name='V6 SVG '+$shape.Id;$shape.AlternativeText=$alternative
 return $shape
}
function Add-Command($slide,$cmd) {
 switch($cmd.kind){
  'text' {[void](Add-Text $slide $cmd.text $cmd.x $cmd.y $cmd.w $cmd.h $cmd.size $cmd.color $cmd.bold)}
  'image' {[void](Add-Image $slide $cmd.src $cmd.x $cmd.y $cmd.w $cmd.h)}
  'icon' {$icon=$manifest.icons.PSObject.Properties[$cmd.icon].Value.PSObject.Properties[$cmd.color].Value;[void](Add-Svg $slide $icon $cmd.x $cmd.y $cmd.w $cmd.h ('Ikon Lucide '+$cmd.icon))}
  'line' {$shape=$slide.Shapes.AddLine($cmd.x*.75,$cmd.y*.75,($cmd.x+$cmd.w)*.75,($cmd.y+$cmd.h)*.75);$shape.Line.ForeColor.RGB=(RGB $cmd.color);$shape.Line.Weight=1.1;$shape.Name='V6 connector '+$shape.Id}
  'box' {$shape=$slide.Shapes.AddShape(1,$cmd.x*.75,$cmd.y*.75,$cmd.w*.75,$cmd.h*.75);$shape.Fill.ForeColor.RGB=(RGB $cmd.fill);$shape.Line.Visible=0;$shape.Name='V6 panel '+$shape.Id}
 }
}
function Set-Notes($slide,[string]$notes){
 foreach($shape in $slide.NotesPage.Shapes){
  if($shape.Type -eq 14 -and $shape.PlaceholderFormat.Type -eq 2){$shape.TextFrame.TextRange.Text=$notes;return}
 }
 throw 'No body placeholder found for speaker notes'
}
function Get-Notes($slide){
 foreach($shape in $slide.NotesPage.Shapes){if($shape.Type -eq 14 -and $shape.PlaceholderFormat.Type -eq 2){return $shape.TextFrame.TextRange.Text}}
 return ''
}
try{
 foreach($f in Get-ChildItem -LiteralPath (Join-Path $deckRoot '.build/fonts') -Filter '*.ttf'){
  if([KatalhysV6Fonts]::AddFontResourceEx($f.FullName,0,[IntPtr]::Zero) -gt 0){$registered+=$f.FullName}
 }
 $app=New-Object -ComObject PowerPoint.Application
 $deck=$app.Presentations.Open($candidate,0,0,0)
 if($deck.Slides.Count -ne 37){throw 'Expected the 37-slide approved source'}
 $originalIds=@($deck.Slides | ForEach-Object {$_.SlideID})
 foreach($property in $manifest.originals.PSObject.Properties){
  $n=[int]$property.Name;$slide=$deck.Slides.FindBySlideID($originalIds[$n-1])
  # Keep original chrome, native logo curves, page marker and template theme.
  for($i=$slide.Shapes.Count;$i -ge 1;$i--){
   $shape=$slide.Shapes.Item($i)
   if($shape.Name -like 'Katalhys background curve*' -or $shape.Name -eq 'Katalhys section accent'){continue}
   if($shape.Top -ge 65*.75 -and $shape.Top -lt 670*.75){$shape.Delete()}
  }
  foreach($command in $property.Value.items){Add-Command $slide $command}
  $notes=Get-Notes $slide
  $sourceIndex=$notes.IndexOf('Sumber isi dan visual:')
  $sources=if($sourceIndex -ge 0){$notes.Substring($sourceIndex)}else{'Sumber isi dan visual: promo/pitch-deck/story.mjs'}
  Set-Notes $slide ($property.Value.notes+"`n`n"+$sources+"`nRiset pengembangan: docs/research/pitch-deck-enhancement-2026-10-28.md")
 }
 # Descending insertions preserve the original numbering used by the manifest.
 for($i=$manifest.extra.Count-1;$i -ge 0;$i--){
  $extra=$manifest.extra[$i]
  $inserted=$deck.Slides.InsertFromFile((Join-Path $build 'additions.pptx'),[int]$extra.after,$i+1,$i+1)
  if($inserted -ne 1){throw 'Additional slide import failed'}
 }
 if($deck.Slides.Count -ne 39){throw 'Expected 39 final slides'}
 $timingTotal=0;$order=@();$fontOverflow=@()
 foreach($slide in $deck.Slides){
  $index=[int]$slide.SlideIndex
  $oldIndex=[array]::IndexOf($originalIds,[int]$slide.SlideID)
  if($oldIndex -ge 0){
   $item=$manifest.originalStory[$oldIndex]
   $seconds=if($item.seconds){[int][Math]::Round($item.seconds*.92)}else{0}
   $title=$item.title.Replace("`n",' ')
  }else{
   $e=if($index -eq 18){$manifest.extra[0]}else{$manifest.extra[1]}
   $seconds=[int]$e.seconds;$title=$e.title
  }
  $timingTotal+=$seconds
  $order+=[PSCustomObject]@{number=$index;original=if($oldIndex -ge 0){$oldIndex+1}else{$null};title=$title;seconds=$seconds}
  $notes=Get-Notes $slide
  $notes=[regex]::Replace($notes,'^Durasi sasaran:[^\r\n]+\s*','')
  $timing=if($seconds){"Durasi sasaran: $seconds detik. Bagian utama, $index/30."}else{'Lampiran opsional, di luar durasi utama.'}
  Set-Notes $slide ($timing+"`n`n"+$notes)
  foreach($shape in $slide.Shapes){
   if($shape.HasTextFrame -eq -1 -and $shape.TextFrame.HasText -eq -1){
    $value=$shape.TextFrame.TextRange.Text
    if($shape.Top -ge 670*.75 -and $value -match '^\d{2}$'){$shape.TextFrame.TextRange.Text=$index.ToString('D2')}
    if($shape.Top -lt 70*.75 -and $shape.Left -gt 700*.75){$shape.TextFrame.TextRange.ParagraphFormat.Alignment=3}
   }
  }
  if($oldIndex -eq 27 -and $Contact){
   [void](Add-Text $slide $Contact 64 632 900 35 22 '#FFFFFF' $true)
  }
  $background=[int]$slide.Background.Fill.ForeColor.RGB
  $tone=if($background -eq (RGB '#1D4ED8')){'blue'}elseif($background -eq (RGB '#17191C')){'dark'}else{'light'}
  $ornament=$manifest.ornaments.PSObject.Properties[$tone].Value[($index-1)%6]
  $ornamentShape=Add-Svg $slide $ornament 0 0 1280 720 'Ornamen Katalhys: kode, koneksi workflow, dan geometri software'
  $ornamentShape.Name='V6 background ornament';$ornamentShape.ZOrder(1)
  # Remove legacy staggered effects before wrapping the page at package level.
  $sequence=$slide.TimeLine.MainSequence
  while($sequence.Count -gt 0){$sequence.Item(1).Delete()}
  $slide.SlideShowTransition.EntryEffect=3849
  $slide.SlideShowTransition.Duration=.65
  $slide.SlideShowTransition.AdvanceOnClick=-1
  $slide.SlideShowTransition.AdvanceOnTime=0
  if($index%5 -eq 0){Write-Output "Enhanced $index/39"}
 }
 $deck.SlideShowSettings.ShowWithAnimation=-1;$deck.SlideShowSettings.AdvanceMode=1
 $deck.SaveAs($candidate,24,-1)
 $deck.Close();$deck=$null
 $python=Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe'
 & $python (Join-Path $PSScriptRoot 'group.py') $candidate
 if($LASTEXITCODE -ne 0){throw 'Editable whole-page grouping failed'}
 $deck=$app.Presentations.Open($candidate,0,0,0)
 foreach($slide in $deck.Slides){
  if($slide.Shapes.Count -ne 1 -or $slide.Shapes.Item(1).Type -ne 6){throw 'Whole-page group did not reopen correctly'}
  $effect=$slide.TimeLine.MainSequence.AddEffect($slide.Shapes.Item(1),10,0,2)
  $effect.Timing.Duration=.55;$effect.Timing.TriggerType=2;$effect.Timing.TriggerDelayTime=0
  $slide.Export((Join-Path $preview ('slide-{0:d2}.png' -f [int]$slide.SlideIndex)),'PNG',1280,720)
  if($slide.SlideIndex%5 -eq 0){Write-Output "Animated and rendered $($slide.SlideIndex)/39"}
 }
 $deck.SaveAs($candidate,24,-1)
 $deck.SaveAs($pdf,32)
 $deck.Close();$deck=$app.Presentations.Open($candidate,-1,0,0)
 foreach($slide in $deck.Slides){
  if($slide.Shapes.Count -ne 1 -or $slide.Shapes.Item(1).Type -ne 6){throw 'Expected one editable visual group per slide'}
  if($slide.TimeLine.MainSequence.Count -ne 1){throw 'Expected exactly one effect per slide'}
  $effect=$slide.TimeLine.MainSequence.Item(1)
  if($effect.Timing.TriggerType -ne 2 -or $effect.Timing.TriggerDelayTime -ne 0){throw 'A reveal requires an extra click or stagger'}
  if($slide.SlideShowTransition.AdvanceOnTime -ne 0){throw 'Unexpected automatic slide advancement'}
  if($slide.SlideShowTransition.EntryEffect -ne 3849){throw 'Missing smooth slide transition'}
 }
 foreach($id in $originalIds){[void]$deck.Slides.FindBySlideID($id)}
 if((Get-FileHash -LiteralPath $manifest.base -Algorithm SHA256).Hash.ToLowerInvariant() -ne $baseHash){throw 'Source file was modified'}
 $receipt=[PSCustomObject]@{slides=39;mainSlides=30;appendixSlides=9;preservedOriginalSlideIds=37;transitions=39;wholeSlideEffects=39;trigger='With Previous';delay=0;effectDuration=.55;transitionDuration=.65;seconds=$timingTotal;powerPointVersion=$app.Version;contactIncluded=[bool]$Contact;candidate=$candidate;pdf=$pdf;order=$order}
 $receipt | ConvertTo-Json -Depth 7 | Set-Content -LiteralPath (Join-Path $build 'powerpoint-check.json') -Encoding utf8
 Write-Output ($receipt | Select-Object -ExcludeProperty order | ConvertTo-Json)
}
finally{
 if($null -ne $deck){$deck.Close();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck)}
 if($null -ne $app){if(-not $wasRunning){$app.Quit()};[void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)}
 foreach($f in $registered){[void][KatalhysV6Fonts]::RemoveFontResourceEx($f,0,[IntPtr]::Zero)}
}
