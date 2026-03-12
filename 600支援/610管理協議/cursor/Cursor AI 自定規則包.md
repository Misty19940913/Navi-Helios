## 🗂️.cursorconfig.yaml 結構版：Navi Helios 系統 × Cursor AI 自定規則包

```yaml
yamlcursorRules:
  - name: "靈感濃縮為核心價值主張"
    folder: "000 捕獲 Inbox"
    description: "將碎片靈感轉化為一句能打動人心的核心價值主張"
    prompt: |
      你是一個內容策略顧問，現在我提供一段靈感碎片，請將它轉化為一句「有情緒張力、能引起注意的核心價值主張」（字數限制在100字內），並標註這句話可以用於哪些情境或內容類型（如文章開場／品牌標語／IG貼文）。

      靈感內容如下：
      “{{selection}}”

  - name: "夢想日記任務拆解"
    folder: "010 夢想日記"
    description: "將日誌文字拆分為使命／任務／子任務三層級"
    prompt: |
      請將以下日誌內容拆解成三層：1. 使命（願景導向），2. 任務（本週目標），3. 子任務（具體執行步驟）。
      使用簡明條列式回覆，適合進入行動板塊。

      日誌內容如下：
      “{{selection}}”

  - name: "專案進度＋下一步生成"
    folder: "020 項目 Projects"
    description: "讀取 Readme 或 Project 文件，生成進度摘要與下一步清單"
    prompt: |
      根據以下專案筆記，請用【已完成 / 進行中 / 待啟動】分類，生成本週進度摘要，並依內容提出可行下一步行動 3 條。

      專案內容如下：
      “{{selection}}”

  - name: "筆記三重點＋學習建議"
    folder: "030 領域 Domains"
    description: "將長筆記提煉為三要點摘要＋學習建議"
    prompt: |
      根據下列筆記內容，請提煉三個核心重點，每點兩行摘要，並附加一個延伸學習建議（閱讀／思考／行動角度皆可）。

      筆記如下：
      “{{selection}}”

  - name: "IG濃縮＋金句＋影片腳本"
    folder: "040 自媒體工作區"
    description: "將文章草稿拆為IG文案、金句、15秒短影片腳本"
    prompt: |
      你是一個社群內容設計師，請將下列內容拆解為：
      1. Instagram 文案（280字以內）
      2. 三句金句（可用於貼文開頭）
      3. 一段15秒短影片腳本（含語速＋音效提示）

      內容如下：
      “{{selection}}”

  - name: "模板結構說明產生器"
    folder: "050 資源 Resources"
    description: "讀取 Obsidian 模板，生成使用說明與推薦應用情境"
    prompt: |
      根據以下 Markdown 模板內容，請分析其結構邏輯，生成100字以內的使用說明，並補充兩種應用情境說明（適用對象／時機）。

      模板內容如下：
      “{{selection}}”
