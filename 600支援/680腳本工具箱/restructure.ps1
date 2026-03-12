# PowerShell Script for Restructuring Navi Helios Vault
# version 1.0.0

# --- 使用說明 ---
# 1. 將此腳本儲存為 `restructure.ps1` 並放置於您的 Obsidian Vault 根目錄。
# 2. 在執行前，請務必關閉 Obsidian 主程式。
# 3. 在您的 Vault 根目錄下，右鍵點擊並選擇 "在終端機中開啟" 或 "Open in Terminal"。
# 4. 輸入 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` 並按 Enter。
# 5. 輸入 `.\restructure.ps1` 並按 Enter 來執行此腳本。
# 6. 完成後，您可以關閉終端機。

function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    $Color = switch ($Type) {
        "INFO"    { "Cyan" }
        "SUCCESS" { "Green" }
        "WARN"    { "Yellow" }
        "ERROR"   { "Red" }
        default   { "White" }
    }
    Write-Host "[$Type] $Message" -ForegroundColor $Color
}

Write-Log "--- 開始執行 Navi Helios 3.5 資料夾結構重組 ---"

# --- 步驟 1: 重新命名核心資料夾 ---
Write-Log "步驟 1: 重新命名核心資料夾..."
$mappings = @{
    "300知識" = "400 知識";
    "400自媒體創作區" = "500 數位資產創作"
}

foreach ($oldName in $mappings.Keys) {
    $newName = $mappings[$oldName]
    if (Test-Path $oldName) {
        try {
            Rename-Item -Path $oldName -NewName $newName -ErrorAction Stop
            Write-Log "成功: 已將 '$oldName' 重新命名為 '$newName'。" -Type SUCCESS
        } catch {
            Write-Log "錯誤: 重新命名 '$oldName' 失敗。$_" -Type ERROR
        }
    } else {
        Write-Log "警告: 找不到資料夾 '$oldName'，可能已被處理。跳過此步驟。" -Type WARN
    }
}

# --- 步驟 2: 整合 500資源 到 600支援系統 ---
Write-Log "`n步驟 2: 整合 500資源..."
$sourceBase = "500資源"
$destBase = "600支援系統" # 根據映射表，內容移至此處

if (Test-Path $sourceBase) {
    # 檢查目標資料夾是否存在，不存在則創建
    if (-not (Test-Path $destBase)) {
        New-Item -ItemType Directory -Path $destBase | Out-Null
        Write-Log "已創建目標資料夾 '$destBase'。"
    }
    
    $resourceMappings = @{
        "510Template" = "620Template";
        "520components" = "630components";
        "530錯誤記憶庫" = "650錯誤記憶庫";
        "540Excaildraw" = "640excaildraw";
        "550歸檔" = "660歸檔";
        "560提示詞" = "670提示詞"
    }

    foreach ($oldDir in $resourceMappings.Keys) {
        $newDir = $resourceMappings[$oldDir]
        $oldPath = Join-Path -Path $sourceBase -ChildPath $oldDir
        $newPath = Join-Path -Path $destBase -ChildPath $newDir

        if (Test-Path $oldPath) {
            try {
                # 確保目標父資料夾存在
                if (-not (Test-Path (Split-Path $newPath -Parent))) {
                    New-Item -ItemType Directory -Path (Split-Path $newPath -Parent) | Out-Null
                }
                
                # 如果新路徑已存在，則移動內容；否則，直接重命名
                if (Test-Path $newPath) {
                    Write-Log "警告: 目標 '$newPath' 已存在，將嘗試合併內容。" -Type WARN
                    Move-Item -Path "$oldPath\*" -Destination $newPath -Force -ErrorAction Stop
                    Remove-Item -Path $oldPath -Recurse -Force -ErrorAction SilentlyContinue
                } else {
                    Rename-Item -Path $oldPath -NewName $newDir -ErrorAction Stop
                    Move-Item -Path (Join-Path -Path $sourceBase -ChildPath $newDir) -Destination $destBase -ErrorAction Stop
                }
                Write-Log "成功: 已處理 '$oldPath' -> '$newPath'。" -Type SUCCESS
            } catch {
                Write-Log "錯誤: 處理 '$oldPath' 失敗。$_" -Type ERROR
            }
        } else {
            Write-Log "警告: 找不到源資料夾 '$oldPath'，可能已被處理。" -Type WARN
        }
    }
} else {
    Write-Log "警告: 找不到 '500資源' 資料夾，跳過整合步驟。" -Type WARN
}


# --- 步驟 3: 刪除遺留與臨時資料夾 ---
Write-Log "`n步驟 3: 刪除遺留與臨時資料夾..."
$foldersToDelete = @(
    "_temp_100_legacy",
    "200領域",
    "500資源",
    "600支援系統" # 舊的支援系統，注意：請確保上面已將內容移至新的 600支援系統
)

# 重新定義 $destBase 以匹配 GEMINI.md 的最終結構
$finalSupportFolder = "600支援"

if (Test-Path "600支援系統" -and -not (Test-Path $finalSupportFolder)) {
    Write-Log "將 '600支援系統' 更名為最終名稱 '$finalSupportFolder'。"
    Rename-Item -Path "600支援系統" -NewName $finalSupportFolder
} elseif (Test-Path "600支援系統" -and (Test-Path $finalSupportFolder)) {
     Write-Log "警告: '$finalSupportFolder' 和 '600支援系統' 同時存在。將合併內容至 '$finalSupportFolder' 後刪除 '600支援系統'。" -Type WARN
     Move-Item -Path "600支援系統\*" -Destination $finalSupportFolder -Force -ErrorAction SilentlyContinue
     Remove-Item -Path "600支援系統" -Recurse -Force -ErrorAction SilentlyContinue
}


foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        Write-Log "正在嘗試刪除 '$folder'..."
        try {
            Remove-Item -Path $folder -Recurse -Force -ErrorAction Stop
            Write-Log "成功: 已刪除資料夾 '$folder'。" -Type SUCCESS
        } catch {
            Write-Log "錯誤: 刪除 '$folder' 失敗，請手動檢查。$_" -Type ERROR
        }
    }
}

Write-Log "--- Navi Helios 3.5 結構重組腳本執行完畢 ---" -Type SUCCESS
