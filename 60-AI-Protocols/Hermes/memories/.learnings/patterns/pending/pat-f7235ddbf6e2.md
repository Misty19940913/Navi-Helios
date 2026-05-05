# Pattern: pat-f7235ddbf6e2
**Tool:** cronjob  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T01:53:26.677329+00:00  
**Last seen:** 2026-05-04T01:53:26.677329+00:00

## Summary
API error in cronjob: {

## Error hashes
- 045ccea3e7ccdec5

## Last error
```
Error Type: api_error
Tool Args: {'action': 'list'}

--- Error Output (last 30 lines) ---
{
  "success": true,
  "count": 1,
  "jobs": [
    {
      "job_id": "4de60db14e20",
      "name": "session-distill",
      "skill": null,
      "skills": [],
      "prompt_preview": "# Session \u84b8\u993e Cron Job\n\n## \u4efb\u52d9\n\u6bcf\u6b21\u53ea\u84b8\u993e 5 \u500b session\uff0c\u6162\u6162\u6d88\u5316\uff0c\u78ba\u4fdd\u54c1\u8cea\u3002\u6383\u63cf\u4e26\u84b8\u993e Hermes session \u7926\u85cf\uff0c\u5c07 confirmed facts \u5beb...",
      "model": null,
      "provider": null,
      "base_url": null,
      "schedule": "every 30m",
      "repeat": "118/300",
      "deliver": "local",
      "next_run_at": "2026-05-04T10:05:54.638630+08:00",
      "last_run_at": "2026-05-04T09:35:54.638630+08:00",
      "last_status": "ok",
      "last_delivery_error": null,
      "enabled": true,
      "state": "scheduled",
      "paused_at": null,
      "paused_reason": null
    }
  ]
}

```
