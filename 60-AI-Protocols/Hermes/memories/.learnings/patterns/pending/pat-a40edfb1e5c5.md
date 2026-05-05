# Pattern: pat-a40edfb1e5c5
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:59:40.539839+00:00  
**Last seen:** 2026-05-05T09:59:40.539839+00:00

## Summary
Tool error in terminal: {"output": "\"shortDescription\":\"视频简介：\\n程序员狂喜！GitNexus开源神器深度评测，自动分析Bug、Review PR、追踪调用链，AI编程从此进入精准时代！保姆级教程！\\n🔥 本期视频详细

## Error hashes
- dd2fbc1ea3db684c

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'curl -s "https://www.youtube.com/watch?v=Zy6tS-7xg9M" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" --compressed 2>&1 | grep -o \'"shortDescription":"[^"]*"\' | head -1 | cut -c1-500; echo "---"; curl -s "https://www.youtube.com/watch?v=Zy6tS-7xg9M" -H "User-Agent: Mozilla/5.0" --compressed 2>&1 | grep -oP \'(?<="videoOwnerRenderer":\\{)[^}]+\' | head -1 | cut -c1-300'}

--- Error Output (last 30 lines) ---
{"output": "\"shortDescription\":\"视频简介：\\n程序员狂喜！GitNexus开源神器深度评测，自动分析Bug、Review PR、追踪调用链，AI编程从此进入精准时代！保姆级教程！\\n🔥 本期视频详细演示了GitHub上爆火的代码智能引擎 GitNexus，这款被誉为\\\"\n---\n\"thumbnail\":{\"thumbnails\":[{\"url\":\"https://yt3.ggpht.com/6AyGuZqZQctDdjIWe9VYpaCVAD84ADoSpCcuUmaw2ANCPJu88x1A5svwfZpW5Hvhapl5N1nuqQ=s48-c-k-c0x00ffffff-no-rj\",\"width\":48,\"height\":48", "exit_code": 0, "error": null}

```
