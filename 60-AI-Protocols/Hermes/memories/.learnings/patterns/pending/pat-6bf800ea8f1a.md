# Pattern: pat-6bf800ea8f1a
**Tool:** read_file  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T20:31:53.685041+00:00  
**Last seen:** 2026-05-07T20:31:53.685041+00:00

## Summary
Tool error in read_file: {"content": "     1|---\n     2|name: Evals\n     3|description: \"Comprehensive AI agent evaluation framework with thre

## Error hashes
- beaa7dd3e3716a4c

## Last error
```
Error Type: tool_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Evals/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: Evals\n     3|description: \"Comprehensive AI agent evaluation framework with three grader types (code-based: deterministic/fast; model-based: nuanced/LLM rubric; human: gold standard) and pass@k / pass^k scoring. Evaluates agent transcripts, tool-call sequences, and multi-turn conversations — not just single outputs. Supports capability evals (~70% pass target) and regression evals (~99% pass target). Workflows: RunEval, CompareModels, ComparePrompts, CreateJudge, CreateUseCase, RunScenario, CreateScenario, ViewResults. Integrates with THE ALGORITHM ISC rows for automated verification. Domain patterns pre-configured for coding, conversational, research, and computer-use agent types in Data/DomainPatterns.yaml. Tools: AlgorithmBridge.ts (ISC integration), FailureToTask.ts (f
```
