$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
$inputDeck=Join-Path $root 'output/katalhys-pitch-id-v6.pptx'
$video=Join-Path $root 'output/contoh-animasi-v6.mp4'
$sample=Join-Path $root '.build/v6/motion-proof.pptx'
if((Test-Path -LiteralPath $video) -or (Test-Path -LiteralPath $sample)){throw 'Use fresh motion proof paths'}
$wasRunning=@(Get-Process POWERPNT -ErrorAction SilentlyContinue).Count -gt 0
$app=New-Object -ComObject PowerPoint.Application
$deck=$null
try{
 $deck=$app.Presentations.Open($inputDeck,-1,0,0)
 for($i=$deck.Slides.Count;$i -ge 1;$i--){if($i -notin @(1,6,16,18,25,27,30)){$deck.Slides.Item($i).Delete()}}
 $deck.SlideShowSettings.ShowWithAnimation=-1
 $deck.SaveAs($sample,24,-1)
 $deck.CreateVideo($video,$false,3,720,30,88)
 $deadline=[DateTime]::UtcNow.AddMinutes(5)
 do{
  Start-Sleep -Seconds 1
  $status=[int]$deck.CreateVideoStatus
  if($status -eq 4){throw 'Native PowerPoint video render failed'}
  if([DateTime]::UtcNow -gt $deadline){throw 'Native PowerPoint video render timed out'}
 }while($status -ne 3)
 Get-Item -LiteralPath $video | Select-Object Name,Length
}
finally{
 if($null -ne $deck){$deck.Saved=-1;$deck.Close();[void][Runtime.InteropServices.Marshal]::ReleaseComObject($deck)}
 if(-not $wasRunning){$app.Quit()}
 [void][Runtime.InteropServices.Marshal]::ReleaseComObject($app)
}
