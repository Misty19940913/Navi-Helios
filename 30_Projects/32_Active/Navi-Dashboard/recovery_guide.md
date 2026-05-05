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

# 緊急還原指南：Navi-Dashboard

## ⚠️ 警告
本系統使用 Python 純標準庫，零外部依賴。絕大多數問題無需還原，應先嘗試重啟服務。

---

## 快速還原步驟

### 方案 A：服務無回應
1. **確認進程是否運行**
   ```bash
   ps aux | grep server.py
   ```

2. **殺掉舊進程**
   ```bash
   pkill -f "server.py"
   ```

3. **重新啟動**
   ```bash
   cd /path/to/Navi-Dashboard
   python3 dashboard/server.py &
   ```

4. **驗證**
   ```bash
   curl http://127.0.0.1:7892/
   ```

### 方案 B：資料損壞
1. **備份現有資料**
   ```bash
   cp -r data/ data_backup_$(date +%Y%m%d%H%M%S)/
   ```

2. **檢查 JSON 語法**
   ```bash
   python3 -c "import json; json.load(open('data/tasks.json'))"
   ```

3. **重建空白資料（如果需要）**
   ```bash
   echo '{}' > data/tasks.json
   echo '[]' > data/agents.json
   ```

### 方案 C：完全還原（從頭開始）
1. **刪除服務**
   ```bash
   pkill -f "server.py"
   rm -rf /path/to/Navi-Dashboard
   ```

2. **從 Git 恢覆（如有）**
   ```bash
   git clone <repo> /path/to/Navi-Dashboard
   ```

3. **重啟服務**
   ```bash
   cd /path/to/Navi-Dashboard
   python3 dashboard/server.py &
   ```

---

## 受影響檔案清單
| 檔案路徑 | 修改類型 | 備份狀態 |
|----------|----------|----------|
| `dashboard/server.py` | [NEW] | 程式碼 |
| `dashboard/index.html` | [NEW] | 程式碼 |
| `dashboard/styles.css` | [NEW] | 程式碼 |
| `dashboard/app.js` | [NEW] | 程式碼 |
| `data/tasks.json` | [NEW/MODIFY] | 需定期備份 |
| `data/agents.json` | [NEW/MODIFY] | 需定期備份 |

---

## 已知風險
| 風險 | 機率 | 影響 | 應對方式 |
|------|------|------|----------|
| Python 版本不相容 | 低 | 服務無法啟動 | 使用 Python 3.9+ |
| Port 被佔用 | 中 | 服務無法啟動 | 改用其他 port |
| JSON 資料損壞 | 低 | 任務資料遺失 | 定期备份 data/ |
| 記憶體不足 | 低 | 服務崩潰 | 監控系統資源 |

---

## 還原檢查清單
- [ ] 確認 server.py 進程正在運行
- [ ] 確認 Dashboard 可正常訪問
- [ ] 確認任務資料完整
- [ ] 確認 Agent 狀態正常顯示

---

## 緊急聯絡人
<!-- 如有需要 -->
Navi（AI 合夥人）/ Misty（Human Boss）

---

*保持此檔案易於訪問，以便出錯時能快速參照*
