- config.yaml sync 已解決：live → GitHub（透過 `~/sync-config-to-brain.sh`）
- hermes update false positive: `rm ~/.hermes/.update_check` 可清除 6hr 缓存的假落後訊息（快取在 git pull --ff 後仍回舊值）
§
- Navi Helios vault：primary = `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`（主要寫入）；remotely-save = 插件備份區，**絕對不要寫入**
- INGEST 一律寫入 primary vault 路徑，勿寫入 remotely-save
- `~/Navi-Helios-vault` 捷徑不存在，每次 INGEST 前都要 `os.path.exists()` 確認路徑
§
hermes update 後必須重啟 gateway：舊行程(PID)記憶體中跑舊程式碼，git pull 只更新硬碟。症狀：ImportError: cfg_get。Fix: `kill <gateway_pid> && hermes gateway start`（或 `hermes gateway restart`）。Gateway 也會更新 user service 定義（systemd）。
§
- 10_Inbox：`/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/10_Inbox/`
- Discord auto_thread 已關閉

## 五個LifeOS框架來源（20260503）
| 代號 | 名稱 | 路徑/URL |
| A | LYT PARA+LifeOS | `/mnt/c/Users/安泰/OneDrive/Obsidian/obsidian-example-lifeos-main` |
| B | 600支援 Ideaverse | `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/600支援/` |
| C | 防彈筆記 Esor | `40_Knowledge/41_原子知識/K-SYS-036` + `K-SYS-060` |
| D | 朱麒 Medium | `~/.hermes/tmp/sources/朱麒_GraphView_*.md` |
| E | 阿哲 Simplifezac | `~/.hermes/tmp/sources/阿哲_LifeOS_01.md` |
| 來源存檔 | `~/.hermes/tmp/sources/` |
§
- Life OS v4.1 vault 策略：新建 vault（`Life-OS-New/`），不直接改動 Navi Helios 現有 vault。現有 vault 為素材參考。
- KCE 框架：Knowledge（原Atlas→Knowledge）/ Calendar / Efforts。Vision/Goal/Effort/Task 隸屬 Efforts 空間，Vision 横跨三空間。
- task_plan.md 是「建構藍圖」（宏觀），system-design.md 是「設計規格」（微觀）。兩者定位不同，不可合併。
- 使用者溝通風格：決策快速直接（D1-D5 五題一回覆），偏好簡潔架構說明後直接問「哪個方向前進」。
- Obsidian CLI 未就緒（需 OBSIDIAN_API_KEY 且 Obsidian app 在 Windows 端運行），vault 操作暫用 read_file/write_file/patch。
§
- HERMES.md 是 skill index（`HERMES.md` = 當前對話的目標，不是 AGENTS.md）
- HERMES.md canonical 在 `C:\Users\安泰\OneDrive\Obsidian\Navi Helios\60-AI-Protocols\Hermes\`
§
一致性檢查觸發條件：當檔案同時包含「立場宣稱段落」與「具體行動指令」時，兩者必須對照檢查。不可只讀立場文字就報告一致——列舉所有具體行動指令（動詞：建立、導入、更新、定義、研究），逐條對照立場，矛盾時回報並停止。
§
記憶疊加路线图：Step1=內建MEMORY.md/USER.md定期餵養 → Step2=honcho-self-hosted → Step3=hindsight → Step4=plur → Step5=flowstate-qmd。用户明确vault只是项目载体，增强Hermes记忆才是本題。