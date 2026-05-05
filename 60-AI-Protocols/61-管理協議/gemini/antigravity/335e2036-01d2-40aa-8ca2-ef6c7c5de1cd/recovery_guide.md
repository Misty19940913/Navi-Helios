---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# 數據損毀緊急還原指南 (Emergency Recovery Guide)

> [!CAUTION]
> **警告：** 由於 PowerShell 指令在執行時未正確宣告 `UTF-8` 編碼，導致現有檔案中的中文字元發生不可逆的物理性損毀（字元遺失或被替代為 `?`）。請勿嘗試使用任何「修復轉換程式」，這會造成二次傷害。

## 方案 A：OneDrive 全域還原 (Restore your OneDrive)
這是最安全、最推薦的做法，可以將整個雲端櫃退回到數小時前的狀態。

1. **登入**：登入網頁版 [OneDrive](https://onedrive.live.com)。
2. **進入還原介面**：點擊「設定（齒輪）」 -> 「選項」 -> 「還原您的 OneDrive」。
3. **選擇時間點**：選擇標記為「自訂日期和時間」，尋找 **今日 (2026-02-27) 凌晨 04:00** 前後的活動紀錄。
4. **驗證並執行**：尋找在大量檔案變動之前的那個紀錄，點擊「還原」。

## 方案 B：Obsidian 檔案救援 (File Recovery)
若只有特定重要檔案需要優先救回，可直接在 Obsidian 內操作。

1. **開啟設定**：`Settings` > `Core plugins` > `File recovery`。
2. **檢視快照**：點擊 `Snapshots` 旁邊的 `View`。
3. **搜尋檔名**：例如搜尋 `一人公司.md`。
4. **時間比對**：找到 1 小時前的快照，點擊 `Replace`。

---
**事後補救：**
請在還原完成後通知我，我將協助您重新建立正確、安全的 YAML 指令，並在執行時強制檢查 UTF-8 編碼一致性。
