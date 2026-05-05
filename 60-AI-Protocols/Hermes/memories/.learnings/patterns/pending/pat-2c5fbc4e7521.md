# Pattern: pat-2c5fbc4e7521
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T06:52:39.633050+00:00  
**Last seen:** 2026-05-04T06:52:39.633050+00:00

## Summary
Tool error in terminal: {"output": "80-System/81-Template/任務模板.md:7:time_created:\n80-System/81-Template/任務模板.md:18:time_start: ''\n80-System/81

## Error hashes
- d62ad01e94005e4b

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'cd "/mnt/c/Users/安泰/OneDrive/Apps/remotely-save/Navi Helios" && grep -n "time_start\\|time_done\\|time_created" \\\n  "80-System/81-Template/任務模板.md" \\\n  "80-System/81-Template/Daily.md" \\\n  "20_Life_Planning/Task/1111-1777274699178.md" 2>/dev/null | head -40'}

--- Error Output (last 30 lines) ---
{"output": "80-System/81-Template/任務模板.md:7:time_created:\n80-System/81-Template/任務模板.md:18:time_start: ''\n80-System/81-Template/任務模板.md:22:time_created:\n80-System/81-Template/任務模板.md:24:time_done: null\n80-System/81-Template/任務模板.md:34:- 建立時間：{{time_created}}\n80-System/81-Template/任務模板.md:35:- 任務期間：{{time_start}} ~ {{time_end}}\n80-System/81-Template/Daily.md:9:time_created: '2026-04-27'\n80-System/81-Template/Daily.md:49:WHERE time_start = date(today) AND status != \"done\"\n80-System/81-Template/Daily.md:58:  time_done AS 完成時間\n80-System/81-Template/Daily.md:60:WHERE time_start = date(today) AND status = \"done\"\n80-System/81-Template
```
