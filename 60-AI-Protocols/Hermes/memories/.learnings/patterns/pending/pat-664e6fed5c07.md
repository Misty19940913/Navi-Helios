# Pattern: pat-664e6fed5c07
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-01T16:56:21.279539+00:00  
**Last seen:** 2026-05-01T16:56:21.279539+00:00

## Summary
Tool error in skill_view: {"success": true, "name": "obsidian-plugin-compilation-debugging", "description": "Obsidian Plugin 從骨架到成功編譯的調試工作流——從 CON

## Error hashes
- 2c9c8e8454d95757

## Last error
```
Error Type: tool_error
Tool Args: {'name': 'obsidian-plugin-compilation-debugging'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "obsidian-plugin-compilation-debugging", "description": "Obsidian Plugin 從骨架到成功編譯的調試工作流——從 CONTRIBUTING.md 發現陷阱、實際執行 npm run dev 診斷錯誤、針對性修復", "tags": [], "related_skills": [], "content": "---\nname: obsidian-plugin-compilation-debugging\ndescription: Obsidian Plugin 從骨架到成功編譯的調試工作流——從 CONTRIBUTING.md 發現陷阱、實際執行 npm run dev 診斷錯誤、針對性修復\ntrigger: 拿到一個 Obsidian Plugin 骨架（無論是新建立或蒸餾來的）需要通過編譯測試時觸發\n---\n\n# Obsidian Plugin 編譯調試工作流\n\n## 觸發條件\n- 拿到一個 Obsidian Plugin 骨架，需要 `npm install && npm run dev` 通過\n- 想了解某個 Plugin 的編譯環境如何設置\n\n## 核心原則\n**永遠先讀 CONTRIBUTING.md**，再執行任何編譯動作。\nPlugin 作者會在 CONTRIBUTING 文件中記錄編譯陷阱，這是最容易被忽略又最關鍵的資訊。\n\n---\n\n## Step 1：找到編譯陷阱（5 分鐘）\n\n### 必讀檔案\n```\nCONTRIBUTING.md      ← 編譯陷阱在此\nREADME.md            ← npm scripts 說明\npackage.json         ← dependencies/devDependencies\nesbuild.config.mjs   ← 構建配置\ntsconfig.json        ← 
```
