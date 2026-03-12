---
tags:
  - 系統/創作
  - YAML規範
status: DONE
time_create: 2026-03-02
time_modifie: 2026-03-02
related:
parent: "[[510SentryPigeon 內容作業系統MOC]]"
---

# 51X-內容矩陣 YAML 規範 (The Metadata Matrix)

> [!abstract] 核心目標
> 終止「一份檔案、多個平台」的數據混亂。透過母子分離的 YAML，確保知識管理的結構性，同時維持社群數據的精準度。

在使用 2.0 系統進行創作時，必須嚴格遵守以下兩種情境的 YAML 元數據規則。

---

## 1. 議題母艦用 YAML (Topic Hub)
**適用時機**：當你在建立整合多平台貼文的 `[Topic-XXX]` MOC 中樞時。
**特色**：著重在「專案推進狀態與關鍵字」，不紀錄按讚、轉發等終端互動指標。

```yaml
---
tags: [系統創作]
status: DOING # 只要底下有平台子檔尚未發布完成，狀態就是 DOING
time_create: 2026-03-02
time_modifie: 2026-03-02
related:
  - "[[某個靈感碎片或日誌]]"
parent: "[[對應530主題分類區中的主題MOC，例如財務防禦區]]"
content_theme: "行動力盲區" # 該議題的分類核心
seo_keywords:
  - 成長心態
  - 三分鐘熱度
  - 系統防禦
---
```

---

## 2. 終端載具用 YAML (Platform Post)
**適用時機**：建立專屬發布於特定平台（如 Threads、IG、Blog、Reels）的實質文案檔案時。
**特色**：嚴格綁定單一發布平台，並提供該平台專屬的互動指標紀錄欄位。

```yaml
---
tags: [系統創作]
status: DONE # 發出後即標記為 DONE
time_create: 2026-03-02
time_modifie: 2026-03-02
related: "[[某個筆記]]" # 必須連回母艦
parent: "[[Topic-某某主題MOC]]"
publish_platforms: 
  - Threads # 只能填寫單一平台 (例如 IG, Threads, Website)
time_publish: 2026-03-02
# --- 平台專屬互動指標區 (依據平台選用) ---
按讚: "120"
留言: "15"
轉發: "30" # Threads 特有高價值指標
分享: "0" 
收藏: "0" # IG/Blog 特有高價值指標
---
```

> [!tip] 數據分離的價值
> 往後當你在做 `[[532-動態選題與測試歸檔]]` 復盤時。你打開 `Topic MOC` 就能看到該主題下的 `[Threads子檔]` 獲得高轉發，但 `[IG子檔]` 卻無人收藏。這能精準定位是「觀點很好」但「圖文轉化失敗」，提供迭代依據。
