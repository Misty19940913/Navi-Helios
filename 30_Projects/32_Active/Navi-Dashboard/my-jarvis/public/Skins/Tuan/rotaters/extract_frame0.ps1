Add-Type -AssemblyName System.Drawing
$src = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Tuan\rotaters\rotaters.png"
$dest = "c:\Users\ghost\OneDrive\Obsidian\Navi Helios\30_Projects\32_Active\Navi-Dashboard\my-jarvis\public\Skins\Tuan\rotaters\frame0.png"

$img = [System.Drawing.Image]::FromFile($src)
$bmp = new-object System.Drawing.Bitmap(600, 600, [System.Drawing.Imaging.PixelFormat]::Format32bppPArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (new-object System.Drawing.Rectangle(0, 0, 600, 600)), (new-object System.Drawing.Rectangle(0, 0, 600, 600)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$img.Dispose()
Write-Host "Success: frame0.png extracted."
