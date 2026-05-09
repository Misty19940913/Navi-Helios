# Pattern: pat-ca3ea6f02f36
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T02:22:01.574520+00:00  
**Last seen:** 2026-05-08T02:22:01.574520+00:00

## Summary
API error in read_file: {"content": "     1|# Company Investment Due Diligence Workflow\n     2|\n     3|## Voice Notification\n     4|\n     5|

## Error hashes
- 700bf1dc550f4d89

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Investigation/src/OSINT/Workflows/CompanyDueDiligence.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|# Company Investment Due Diligence Workflow\n     2|\n     3|## Voice Notification\n     4|\n     5|```bash\n     6|curl -s -X POST http://localhost:8888/notify \\\n     7|  -H \"Content-Type: application/json\" \\\n     8|  -d '{\"message\": \"Running the CompanyDueDiligence workflow in the OSINT skill to vet investments\"}' \\\n     9|  > /dev/null 2>&1 &\n    10|```\n    11|\n    12|Running the **CompanyDueDiligence** workflow in the **OSINT** skill to vet investments...\n    13|\n    14|**Purpose:** Comprehensive 5-phase investment vetting combining domain-first OSINT, technical reconnaissance, multi-source research, and investment risk assessment.\n    15|\n    16|**Authorization Required:** Only for authorized investment vetting and business intelligence.\n    17|\n    1
```
