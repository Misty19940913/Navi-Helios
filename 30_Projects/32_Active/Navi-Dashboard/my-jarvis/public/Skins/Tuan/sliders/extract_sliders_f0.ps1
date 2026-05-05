Add-Type -AssemblyName System.Drawing
$src = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Tuan\sliders\sliders.png"
$dest = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Tuan\sliders\frame0.png"

$img = [System.Drawing.Image]::FromFile($src)
# Let's assume the frame size is the same as rotaters (600x600) or check width.
# Sliders.png is 4.9MB. 4.9MB / 4 bytes per pixel = 1.2M pixels. 
# If it's 161 frames, maybe it's smaller?
$frameHeight = $img.Height
$frameWidth = $img.Width / 161

$bmp = new-object System.Drawing.Bitmap($frameWidth, $frameHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppPArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (new-object System.Drawing.Rectangle(0, 0, $frameWidth, $frameHeight)), (new-object System.Drawing.Rectangle(0, 0, $frameWidth, $frameHeight)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Host "Success: frame0.png extracted ($frameWidth x $frameHeight)."
