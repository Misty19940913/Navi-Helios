# T27 — Tools Python

> 組ID：T27
> 來源：Tools/**/*.py, tools/**/*.py, PAI/TOOLS/*.py
> 檔案總數：240（所有版本），v5.0.0 主要：1
> 採樣分析：2 個核心檔案
> 優先級：🟡 中

---

## 檔案結構分析

Python 工具在 PAI v5.0.0 生態中有兩種存在形式：

### 1. UV 獨立腳本（v5.0.0 主要形式）

使用 PEP 723 內聯依賴規範，可直接透過 `uv run` 執行，無需手動安裝依賴。

### 2. 傳統 Python 腳本（v4.x 生態）

散落於各個 Pack 的 Scripts 目錄中，每個腳本處理特定的文檔格式轉換工作。

---

## 核心檔案分析

### extract-transcript.py

**功能：** 語音轉文字工具，使用 faster-whisper 從音訊/影片檔案中提取字幕。

**技術規格：**

| 項目 | 規格 |
|------|------|
| 引擎 | faster-whisper（WhisperModel） |
| 設備 | CPU（compute_type: int8）|
| 預設模型 | base.en |
| 支援格式 | m4a, mp3, wav, flac, ogg, aac, wma, mp4, mov, avi, mkv, webm, flv |
| 輸出格式 | txt, json, srt, vtt |

**關鍵函式：**

- `transcribe_file()`：初始化 WhisperModel，執行轉譯
- `format_transcript()`：格式化輸出（txt/json/srt/vtt）
- `format_time_srt()` / `format_time_vtt()`：SRT/VTT 時間格式
- `save_transcript()`：輸出到磁碟
- `get_files_from_directory()`：批次處理目錄

**使用範例：**
```bash
uv run extract-transcript.py audio.m4a
uv run extract-transcript.py video.mp4 --model large-v3 --format srt
uv run extract-transcript.py ~/Podcasts/ --batch
```

---

## v4.x Python 工具生態（歷史參考）

240 個 Python 檔案大多分佈在 v4.0.0、v4.0.1 等舊版本中：

| 類別 | 數量 | 範例 |
|------|------|------|
| PDF 處理 | 20+ | fill_pdf_form_with_annotations.py, convert_pdf_to_images.py |
| PPTX 處理 | 15+ | rearrange.py, replace.py, thumbnail.py |
| DOCX 處理 | 10+ | unpack.py, validate.py, pack.py |
| XLSX 處理 | 5+ | recalc.py |
| Web 自動化 | 10+ | with_server.py, element_discovery.py |
| 安全評估 | 10+ | osint-api-tools.py, ffuf-helper.py |

---

## 與 Life-OS 的借鑒點

### 1. PEP 723 內聯依賴 → 零配置工具分發
`# /// script` 區塊讓工具無需 requirements.txt 或虛擬環境即可執行。對於 Life-OS 的 CLI 工具，這是理想的分發格式。

### 2. faster-whisper 語音轉文字 → 會議記錄自動化
extract-transcript.py 示範了如何將 AI 語音辨識封裝為易用的 CLI 工具。Life-OS 可借鑒此模式處理會議錄音。

### 3. 批次處理模式 → 大量檔案操作
`--batch` flag + `get_files_from_directory()` 的模式適用於任何需要對整個資料夾執行相同操作的場景。

---

## 關聯檔案

- T06 — Hook TypeScript（TS 對應實作）
- T26 — PAI CORE TS（Tools 目錄的 TypeScript 工具）
- AudioEditor Pack（音訊處理相關）

---

## 檔案清單（分析樣本）

```
Releases/v5.0.0/.claude/PAI/TOOLS/extract-transcript.py
Tools/README.md
Tools/BackupRestore.ts
Tools/validate-protected.ts
```
