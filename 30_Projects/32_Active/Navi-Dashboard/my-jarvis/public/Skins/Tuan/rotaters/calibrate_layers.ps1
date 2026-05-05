Add-Type -AssemblyName System.Drawing
$outDir = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Tuan\rotaters"

$results = @()

for($i=1; $i -le 5; $i++) {
    $filePath = "$outDir\frame$i.png"
    if(Test-Path $filePath) {
        $img = [System.Drawing.Image]::FromFile($filePath)
        $bmp = new-object System.Drawing.Bitmap($img)
        
        $sumX = 0; $sumY = 0; $count = 0
        for($x=0; $x -lt $bmp.Width; $x++) {
            for($y=0; $y -lt $bmp.Height; $y++) {
                $pixel = $bmp.GetPixel($x, $y)
                if($pixel.A -gt 10) {
                    $sumX += $x
                    $sumY += $y
                    $count++
                }
            }
        }
        
        if($count -gt 0) {
            $cX = [Math]::Round(($sumX / $count), 2)
            $cY = [Math]::Round(($sumY / $count), 2)
            $results += "Layer $i (frame$i.png): Center X=$cX, Y=$cY"
        } else {
            $results += "Layer $i (frame$i.png): NO PIXELS FOUND"
        }
        
        $bmp.Dispose()
        $img.Dispose()
    }
}

$results | Out-File "$outDir\calibration_results.txt"
$results
