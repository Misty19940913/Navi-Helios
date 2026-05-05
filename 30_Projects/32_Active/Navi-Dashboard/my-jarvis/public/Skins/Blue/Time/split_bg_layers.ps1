Add-Type -AssemblyName System.Drawing
$src = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Blue\Time\TimeBG.png"
$outDir = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Blue\Time"

$img = [System.Drawing.Image]::FromFile($src)
$bmp = new-object System.Drawing.Bitmap($img)
$w = $bmp.Width
$h = $bmp.Height

# Master Pivot Point
$cX = 429
$cY = 231

# Defined Split Thresholds from Scan
$layers = @(
    @{name="bg_core";   min=0;   max=65},
    @{name="bg_inner";  min=66;  max=112},
    @{name="bg_mid";    min=113; max=165},
    @{name="bg_outer";  min=166; max=1000}
)

Write-Host "Physically splitting TimeBG into layers..."

foreach($l in $layers) {
    $outPath = "$outDir\$($l.name).png"
    $newBmp = new-object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    for($x=0; $x -lt $w; $x++) {
        for($y=0; $y -lt $h; $y++) {
            $dx = $x - $cX
            $dy = $y - $cY
            $dist = [Math]::Sqrt($dx*$dx + $dy*$dy)
            
            if($dist -ge $l.min -and $dist -le $l.max) {
                 $newBmp.SetPixel($x, $y, $bmp.GetPixel($x, $y))
            } else {
                 $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            }
        }
    }
    $newBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose()
    Write-Host "Saved Layer: $($l.name).png"
}

$bmp.Dispose()
$img.Dispose()
Write-Host "Deconstruction complete."
