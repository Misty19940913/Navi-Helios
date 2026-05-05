# Pattern: pat-e1901cfef70d
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:27:29.645426+00:00  
**Last seen:** 2026-05-05T10:27:29.645426+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: webhook-subscriptions\n     3|description: Create and manage webhook subscriptions

## Error hashes
- 857023cc5dda7a59

## Last error
```
Error Type: api_error
Tool Args: {'path': './hermes-backup-20260425-164411/skills/devops/webhook-subscriptions/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: webhook-subscriptions\n     3|description: Create and manage webhook subscriptions for event-driven agent activation, or for direct push notifications (zero LLM cost). Use when the user wants external services to trigger agent runs OR push notifications to chats.\n     4|version: 1.1.0\n     5|metadata:\n     6|  hermes:\n     7|    tags: [webhook, events, automation, integrations, notifications, push]\n     8|---\n     9|\n    10|# Webhook Subscriptions\n    11|\n    12|Create dynamic webhook subscriptions so external services (GitHub, GitLab, Stripe, CI/CD, IoT sensors, monitoring tools) can trigger Hermes agent runs by POSTing events to a URL.\n    13|\n    14|## Setup (Required First)\n    15|\n    16|The webhook platform must be enabled before subscriptions can be created. Check with:\n
```
