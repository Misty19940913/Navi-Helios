# Pattern: pat-a0a5b4f54bb3
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T13:22:27.565212+00:00  
**Last seen:** 2026-05-05T13:22:27.565212+00:00

## Summary
Tool error in terminal: {"output": "4:trigger: 要新建、重建、或大幅修改一個 SKILL.md 時觸發\n80:trigger: 什麼情況觸發此 skill\n125:- 有的寫在 frontmatter 根層級（`trigger:` 在 `

## Error hashes
- 02b12be16df3169a

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "trigger:" /home/misty/.hermes/skills/skill-authoring/SKILL.md | head -5'}

--- Error Output (last 30 lines) ---
{"output": "4:trigger: 要新建、重建、或大幅修改一個 SKILL.md 時觸發\n80:trigger: 什麼情況觸發此 skill\n125:- 有的寫在 frontmatter 根層級（`trigger:` 在 `---` 後第一行）\n133:格式：在 frontmatter 的 `description:` 行之後、`version:`（或 `metadata:`）行之前，直接新增 `trigger:` 區塊（不在 metadata.hermes 裡面）。\n241:壞例子：`trigger: \"被問到相關問題時\"`（太廣，會被錯誤觸發）", "exit_code": 0, "error": null}

```
