Add-Type -AssemblyName System.Drawing
$filePath = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Blue\Time\bg_inner.png"

$img = [System.Drawing.Image]::FromFile($filePath)
$bmp = new-object System.Drawing.Bitmap($img)

$sumX = 0; $sumY = 0; $count = 0
for($x=0; $x -lt $bmp.Width; $x++) {
    for($y=0; $y -lt $bmp.Height; $y++) {
        $pixel = $bmp.GetPixel($x, $y)
        # Scan visible tech lines
        if($pixel.A -gt 15) {
            $sumX += $x
            $sumY += $y
            $count++
        }
    }
}

if($count -gt 0) {
    $cX = [Math]::Round(($sumX / $count), 2)
    $cY = [Math]::Round(($sumY / $count), 2)
    Write-Host "Detected Real Pivot for Blue Background: X=$cX, Y=$cY"
}

$bmp.Dispose()
$img.Dispose()
