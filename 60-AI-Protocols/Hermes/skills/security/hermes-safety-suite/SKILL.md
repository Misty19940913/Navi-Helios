---
name: hermes-safety-suite
description: Hermes 安全三件套：我在執行任務時的自我保護機制。針對我的威脅模型、防禦層次、配置原則。
---

# Hermes 安全三件套

> 這是**我自己在執行任務時的自我保護機制**，不是只給用戶看的手冊。

## 我的威脅模型

我在 Hermes 環境中執行任務時，面對的威脅主要有：

| 威脅類型 | 說明 | 現有防御 |
|:--|:--|:--|
| **誤刪檔案** | `rm -rf` 打錯字、選錯目錄 | `rm` → `trash` alias |
| **危險指令** | `git reset --hard`、`dd`、`sudo` | `approval.py` DANGEROUS_PATTERNS（45+ 條）|
| **自我終止** | 執行了 `pkill hermes` 或 `hermes gateway stop` | approval.py 已有保護 |
| **內容攻擊** | 惡意 skill、prompt injection | `skills_guard.py` 掃描 |
| **SSRF** | 請求內部雲端元資料端點 | `url_safety.py` 永遠封鎖 169.254.169.254 |
| **路徑跳脫** | `../../../etc/passwd` | `path_security.py` 檢查 |
| **遠端程式碼執行** | `curl \| sh`、`bash -c "..."` | DANGEROUS_PATTERNS 中的 Shell 類規則 |
| **敏感資料外洩** | skill 試圖讀取 `~/.hermes/.env` | `skills_guard.py` 檢測 |

---

## 第一層：rm → trash（誤刪防線）

### 我的配置

```bash
# ~/.zshrc
alias rm='trash'      # 誤刪可還原
alias rm!='/bin/rm'   # 真的永久刪除
```

**驗證方式：**
```bash
source ~/.zshrc && type rm  # 確認是 alias for trash
touch /tmp/test-rm.txt && rm /tmp/test-rm.txt && trash-list  # 確認進垃圾桶
```

### WSL 特殊處理

WSL 環境垃圾桶映射到 Windows資源回收筒，使用 `gio trash`：

```bash
# WSL 用戶
alias rm='gio trash'
alias rm!='/bin/rm'
```

---

## 第二層：危險指令黑名單（已內建）

Hermes `tools/approval.py` 的 `DANGEROUS_PATTERNS` 已涵蓋：

| 類別 | 代表規則 |
|:--|:--|
| 刪除類 | `rm -rf /`, `rm -r` 根目錄 |
| 磁碟類 | `mkfs`, `dd`, `> /dev/sd*` |
| Git 破壞類 | `git reset --hard`, `git push --force`, `git clean -f`, `git branch -D` |
| 權限類 | `chmod 777`, `chown root` |
| Shell 執行類 | `bash -c`, `python -e`, `curl \| sh` |
| 自毀類 | `hermes gateway stop/restart`, `pkill hermes` |
| SQL 破壞類 | `DROP TABLE`, `DELETE without WHERE`, `TRUNCATE` |
| 敏感路徑寫入 | `> /etc/`, `~/.ssh/`, `~/.hermes/.env` |

### 我的自訂擴展（如有需要）

透過 `~/.hermes/config.yaml` 新增：

```yaml
dangerous_commands:
  custom_deny:
    - shutdown
    - reboot
    - init 0
    - halt
```

---

## 第三層：確認模式選擇

Hermes 的確認模式透過 `approval.py` 的 YOLO bypass 控制。

### 我的預設選擇

**我自己用 `Accept Edits`（推薦新手）：**
- 檔案操作：不問（符合預期）
- 終端指令：問（保留掌控感）
- 危險指令：黑名單直接擋（底層保護）

### 四種模式

| 模式 | 行為 | 適用場景 |
|:--|:--|:--|
| `Accept Edits`（推薦）| 檔案操作直接做，終端指令問 | 大多數任務 |
| `Default` | 所有操作都問 | 觀察學習期 |
| `Plan` | 只規劃不執行 | 大改造、需要全觀 |
| `Bypass` | 除了黑名單都不問 | 高信任、熟練用戶 |

---

## 我的配置原則

1. **永遠開啟黑名單**：不改 `approval.py` 的 `DANGEROUS_PATTERNS`
2. **YOLO 只在確定安全時開**：從 Accept Edits 開始，隨信任成長
3. **用 `clarify` 工具**：遇到不確定的指令時，主動問用戶
4. **驗證後再疊加**：每次加新的保護層，先測試確認有效

---

## 現有安全機制地圖

```
Hermes 安全架構
├── approval.py — 危險指令偵測（45+ 規則，含 self-termination 保護）
├── tirith_security.py — 內容層級安全掃描（可選，自動安裝）
├── skills_guard.py — 外部 skill 安裝前掃描（6 大類威脅）
├── url_safety.py — SSRF 保護（私有 IP + 雲端元資料永遠封鎖）
├── path_security.py — 路徑跳脫檢查
└── terminal_tool.py — 執行環境隔離（docker/modal/singularity/ssh）
```

---

## 踩坑紀錄

- **為什麼不默认开 Bypass？** Bypass 下我仍然受黑名單保護，但錯誤決策的範圍變大。新手不應該跳過這個成長過程。
- **為什麼 `rm` alias 不是萬能的？** 有些程式（如 `find -delete`）不經過 `rm` alias。這就是為什麼第二層黑名單更重要。
- **Tirith 失敗了怎麼辦？** Tirith 的 `fail_open: true` 預設意味著掃描失敗時會放行。這是已知限制，不影響黑名單保護。

---

## 遇到問題時

1. **不確定的指令** → 用 `clarify` 問用戶
2. **看起來可疑的 skill** → 不安裝，叫用戶確認
3. **被黑名單擋住但確定安全** → 告知用戶，手動處理
4. **URL 請求失敗（SSRF 保護）** → 記錄並告知，不繞過

---

## 延伸資源

- `tools/approval.py` — 危險指令模式定義
- `tools/skills_guard.py` — skill 安全掃描
- `tools/tirith_security.py` — 內容安全掃描
- `tools/url_safety.py` — URL/SSRF 保護
- `tools/path_security.py` — 路徑安全驗證
