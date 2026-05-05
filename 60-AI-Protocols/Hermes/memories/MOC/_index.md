# MOC — 領域索引總覽

## 目的

Layer 2：各領域的記憶入口。新 session 依 topic 讀對應 MOC，再深入 Layer 3。

## MOC 列表

| MOC | 描述 |
|-----|------|
| `user.md` | 用戶偏好、溝通風格、現有目標 |
| `projects.md` | 所有專案索引 |
| `lessons.md` | 踩坑與方法論索引 |

## 讀取方式

```
1. session 啟動 → 讀 MEMORY.md
2. 依 topic → 讀對應 MOC
3. MOC 內有 area 檔索引 → 讀 Layer 3
```

## 同步機制

| 層次 | 位置 | 說明 |
|------|------|------|
| WSL 端 | `~/.hermes/memories/` | **symlink** → vault |
| Canonical | `.../Navi Helios/60-AI-Protocols/Hermes/memories/` | 真實資料（OneDrive 即時同步） |
| GitHub | `Hermes-Brain/` private repo | 備份（需手動 commit 同步） |

**原則**：vault 是 canonical，WSL 端是 symlink 視圖。不可信任 WSL 端絕對路徑——真實資料在 vault 內。
