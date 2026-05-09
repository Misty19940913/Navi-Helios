# T25 — Remotion Pack

> 組ID：T25
> 來源：Packs/Remotion, Releases/v5.0.0/.claude/skills/Remotion
> 檔案總數：40+
> 採樣分析：7 個核心檔案
> 優先級：🟡 中高

---

## 檔案結構分析

Remotion Pack 是 PAI 系統的**程序化影片生成工具**——透過 React + Remotion 框架來構建 MP4 影片。

**三層架構：**

**主控層（SKILL.md + CriticalRules.md）**
- `SKILL.md`：技能路由——ContentToAnimation / GeneratedContentVideo 兩個工作流
- `CriticalRules.md`：10 條禁止規則（CSS 動畫、第三方動畫庫等）

**工具層（Tools/）**
- `Render.ts`：Remotion CLI 包裝器——render、listCompositions、createProject、renderStill、startStudio、upgrade
- `Theme.ts`：PAI 主題常量——顏色、排版、動效彈簧配置、間距、陰影
- `Ref-*.md`：31 個模式參考檔案（gifs、videos、audio、text-animations、transitions、charts、3d、lottie、fonts、images 等）

### Pack 與 v5.0.0 版本差異
兩版本內容高度一致，屬於同步發布。

---

## 核心機制

### 動畫原理：useCurrentFrame() + interpolate()

Remotion 的核心約束：**所有動畫必須通過 `useCurrentFrame()` 驅動**，而非 CSS @keyframes。Render 是逐幀讀取 DOM 狀態——CSS 動畫依賴連續時間軸，在渲染時不會產生任何輸出。

```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
```

關鍵函數：
- `useCurrentFrame()`：獲取當前幀編號
- `interpolate()`：在幀範圍內映射值
- `spring()`：彈簧動畫
- `staticFile()`：處理 public 資源路徑

### CriticalRules 十大禁令

| 規則 | 原因 |
|------|------|
| 禁止 CSS 動畫 | 渲染器逐幀讀取 DOM，CSS 動畫在渲染時不產生輸出 |
| 禁止第三方動畫庫 | Framer Motion/GSAP/React Spring 依賴 requestAnimationFrame，非 Remotion 幀計數器 |
| 必須用 staticFile() | 確保 Studio 和 Server 渲染路徑一致 |
| 必須 clamp interpolate | 未 clamp 的值會溢出（opacity > 1、負尺寸、顏色越界） |
| 必須用 Zod schema 定義 props | 否則 Studio 無法編輯、CLI --props 無法傳遞 |
| renderStillOnWeb() v4.0.447+ 返回物件 | 不再返回原始 URL |
| AV1 有平台限制 | Linux ARM64 GNU 和 Lambda 不可用 |
| Lambda 商業使用需付費 | 個人使用免費，團隊商業使用需 Remotion 許可 |
| toneFrequency 僅 Server 端有效 | Studio preview / Player 預覽聲音可能不准 |
| 必須用 bunx | 從不用 npx |

### Render.ts 的 CLI 包裝

Render.ts 封裝了 Remotion CLI 的完整介面，包括：
- render()：渲染影片（支援 codec、crf、fps、dimensions、audio 參數）
- renderStill()：渲染靜幀
- listCompositions()：列出所有合成
- startStudio()：啟動 Remotion Studio 預覽伺服器
- createProject()：創建新項目（blank/hello-world/three/audiogram/tts 模板）
- upgrade()：升級 Remotion 包
- getVideoMetadata() / getAudioDuration()：獲取媒體元數據

### PAI_THEME 主題系統

Theme.ts 定義了完整的 PAI 主題常量：

| 類別 | 內容 |
|------|------|
| colors | background（深板岩色）、accent（紫色系）、text、utility |
| typography | 5 級字體大小（title/subtitle/heading/body/caption）|
| animation | 彈簧配置（fast/default/slow/bouncy）+ 幀持續時間 + stagger 延遲 |
| spacing | page/section/element/tight 間距系統 |
| effects | textShadow、boxShadow、glow |
| borderRadius | sm/md/lg/full |

---

## 與 Life-OS 的借鑒點

### 1. CriticalRules 模式 → 系統約束清單
將「常見失敗模式」寫成強制性禁令清單——每個系統都應有自己的 CriticalRules，列出破壞性操作而非只描述正確流程。

### 2. Theme.ts → 設計系統常量集中定義
顏色/排版/動效/間距在同一個常數檔案中定義，確保所有下游消費一致——Life-OS 也應有統一的 Theme.ts。

### 3. useCurrentFrame() 驅動模型 → 時間軸驅動的狀態機
Remotion 每次渲染都從 frame=0 重新計算狀態——這個模型適用於任何時間軸驅動的系統（影片、動畫、甚至是複雜的狀態動畫）。

### 4. Render.ts 的 CLI 包裝 → 工具介面一致性
所有外部工具都透過統一的 TypeScript 介面包裝，而非直接暴露 CLI——確保工具變更有單一變更點。

---

## 關聯檔案

- T21 — Art Pack（視覺美學相關，Remotion 引用 Art 的 PREFERENCES.md）
- T26 — PAI CORE TS（Render.ts 的 TypeScript 實現）
- 框架索引中所有與媒體/工具相關的報告

---

## 檔案清單（分析樣本）

```
Packs/Remotion/src/SKILL.md
Packs/Remotion/src/CriticalRules.md
Packs/Remotion/src/Tools/Render.ts
Packs/Remotion/src/Tools/Theme.ts
Packs/Remotion/src/Tools/Ref-gifs.md
Packs/Remotion/src/Tools/Ref-videos.md
Packs/Remotion/src/Tools/Ref-text-animations.md
Packs/Remotion/src/Tools/Ref-transitions.md
Packs/Remotion/src/Tools/Ref-charts.md
Packs/Remotion/src/Tools/Ref-3d.md
Packs/Remotion/INSTALL.md
Packs/Remotion/VERIFY.md
```
