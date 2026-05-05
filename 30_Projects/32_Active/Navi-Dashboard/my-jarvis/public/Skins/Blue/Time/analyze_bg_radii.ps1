Add-Type -AssemblyName System.Drawing
$src = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Blue\Time\TimeBG.png"

$img = [System.Drawing.Image]::FromFile($src)
$bmp = new-object System.Drawing.Bitmap($img)

# Center of the Blue Time Clock
$centerX = 429
$centerY = 231

Write-Host "Analyzing TimeBG radial layers from center(429, 231)..."
$density = new-object 'int[]' 600

for($x=0; $x -lt $bmp.Width; $x++) {
    for($y=0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Scan glowy/visible pixels
        if($pixel.A -gt 20 -and ($pixel.R -gt 20 -or $pixel.G -gt 20 -or $pixel.B -gt 20)) {
            $dx = $x - $centerX
            $dy = $y - $centerY
            $dist = [Math]::Floor([Math]::Sqrt($dx*$dx + $dy*$dy))
            if($dist -lt 600) {
                $density[$dist]++
            }
        }
    }
}

for($r=0; $r -lt 600; $r++) {
    if($density[$r] -gt 5) {
        Write-Host "Radius $r : $($density[$r]) pixels"
    }
}

$bmp.Dispose()
$img.Dispose()
