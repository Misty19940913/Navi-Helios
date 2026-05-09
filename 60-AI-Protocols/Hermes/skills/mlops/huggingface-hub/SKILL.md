---
name: huggingface-hub
description: "HuggingFace hf CLI: search/download/upload models, datasets."
version: 1.0.0
author: Hugging Face
license: MIT
tags: [huggingface, hf, models, datasets, hub, mlops]
triggers:
  - "download model from huggingface"
  - "download from huggingface hub"
  - "huggingface download"
  - "hf download"
  - "upload model to huggingface"
  - "upload to huggingface hub"
  - "huggingface upload"
  - "hf upload"
  - "huggingface cli"
  - "hf cli"
  - "huggingface hub model"
  - "list huggingface models"
  - "huggingface datasets"
  - "hf models list"
  - "huggingface spaces"
  - "inference endpoints huggingface"
  - "huggingface auth login"
  - "hf token"
  - "search huggingface models"
  - "find model on huggingface"
  - "clone huggingface repo"
  - "huggingface repo create"
  - "sync huggingface bucket"
---

# Hugging Face CLI (`hf`) Reference Guide

The `hf` command is the modern command-line interface for interacting with the Hugging Face Hub, providing tools to manage repositories, models, datasets, and Spaces.

> **IMPORTANT:** The `hf` command replaces the now deprecated `huggingface-cli` command.

## Quick Start
*   **Installation:** `curl -LsSf https://hf.co/cli/install.sh | bash -s`
*   **Help:** Use `hf --help` to view all available functions and real-world examples.
*   **Authentication:** Recommended via `HF_TOKEN` environment variable or the `--token` flag.

---

## Core Commands

### General Operations
*   `hf download REPO_ID`: Download files from the Hub.
*   `hf upload REPO_ID`: Upload files/folders (recommended for single-commit).
*   `hf upload-large-folder REPO_ID LOCAL_PATH`: Recommended for resumable uploads of large directories.
*   `hf sync`: Sync files between a local directory and a bucket.
*   `hf env` / `hf version`: View environment and version details.

### Authentication (`hf auth`)
*   `login` / `logout`: Manage sessions using tokens from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
*   `list` / `switch`: Manage and toggle between multiple stored access tokens.
*   `whoami`: Identify the currently logged-in account.

### Repository Management (`hf repos`)
*   `create` / `delete`: Create or permanently remove repositories.
*   `duplicate`: Clone a model, dataset, or Space to a new ID.
*   `move`: Transfer a repository between namespaces.
*   `branch` / `tag`: Manage Git-like references.
*   `delete-files`: Remove specific files using patterns.

---

## Specialized Hub Interactions

### Datasets & Models
*   **Datasets:** `hf datasets list`, `info`, and `parquet` (list parquet URLs).
*   **SQL Queries:** `hf datasets sql SQL` — Execute raw SQL via DuckDB against dataset parquet URLs.
*   **Models:** `hf models list` and `info`.
*   **Papers:** `hf papers list` — View daily papers.

### Discussions & Pull Requests (`hf discussions`)
*   Manage the lifecycle of Hub contributions: `list`, `create`, `info`, `comment`, `close`, `reopen`, and `rename`.
*   `diff`: View changes in a PR.
*   `merge`: Finalize pull requests.

### Infrastructure & Compute
*   **Endpoints:** Deploy and manage Inference Endpoints (`deploy`, `pause`, `resume`, `scale-to-zero`, `catalog`).
*   **Jobs:** Run compute tasks on HF infrastructure. Includes `hf jobs uv` for running Python scripts with inline dependencies and `stats` for resource monitoring.
*   **Spaces:** Manage interactive apps. Includes `dev-mode` and `hot-reload` for Python files without full restarts.

### Storage & Automation
*   **Buckets:** Full S3-like bucket management (`create`, `cp`, `mv`, `rm`, `sync`).
*   **Cache:** Manage local storage with `list`, `prune` (remove detached revisions), and `verify` (checksum checks).
*   **Webhooks:** Automate workflows by managing Hub webhooks (`create`, `watch`, `enable`/`disable`).
*   **Collections:** Organize Hub items into collections (`add-item`, `update`, `list`).

---

## Steps

### 1. Check auth status

```bash
hf whoami
```

If not logged in → set `HF_TOKEN` env var or run `hf auth login`.

### 2. Identify the operation type

| What you need | Command |
|---------------|---------|
| Download files | `hf download REPO_ID` |
| Upload files | `hf upload REPO_ID` |
| Create a repo | `hf repos create` |
| List models/datasets | `hf models list` / `hf datasets list` |
| Manage releases | `hf repos delete` / duplicate / move |
| Run inference endpoint | `hf endpoints deploy` |
| Execute SQL on dataset | `hf datasets sql SQL` |
| Manage discussions/PRs | `hf discussions list` |

### 3. Execute

Use the appropriate `hf` command. Use `--format json` for machine-readable output, `-q` for quiet (IDs only).

### 4. Verify

| Operation | Verification |
|-----------|--------------|
| Download | Files exist at target path; `hf cache verify` checks checksums |
| Upload | `hf info REPO_ID` shows the uploaded files |
| Create repo | `hf repos list` shows the new repo |
| Delete | API returns success; repo no longer appears in list |
| Deploy endpoint | `hf endpoints list` shows running endpoint with URL |

### 5. Handle failures

- **403 Forbidden** → token missing or lacks permission; check `HF_TOKEN` and token scopes
- **404 Not Found** → repo doesn't exist or you have no access; verify spelling and auth
- **Upload too large** → break into chunks or use `hf upload-large-folder`
- **Rate limited** → wait and retry; check `hf rate-limits`

---

## Verification

```bash
# Check you're authenticated
hf whoami

# List your repos (confirms access)
hf repos list

# Verify downloaded file checksum
hf cache verify

# Check endpoint status
hf endpoints list
```

---

## Common Pitfalls

- ❌ **Using `huggingface-cli`** — deprecated; use `hf` instead
- ❌ **Missing `--token`** when operating on private repos — set `HF_TOKEN` env var instead
- ❌ **Uploading large folders with `hf upload`** — use `hf upload-large-folder` for resumable uploads
- ❌ **Not specifying `--meta` or commit message** — uploads always require a commit message
- ❌ **Confusing model repo ID** — format is `namespace/model-name` (e.g., `meta-llama/Llama-3-8B`)
- ❌ **Deleting without confirming** — `hf repos delete` is permanent; list first to confirm target

---

## Advanced Tips

- Use `--format json` for scripting: `hf models list --filter architecture:bert --format json`
- `hf extensions install REPO_ID` extends CLI with custom commands
- `hf skills add` manages AI assistant skills for the hub
- Buckets (S3-like storage): `hf buckets cp`, `sync`, `rm` — useful for dataset pipelines
- Webhooks: `hf webhooks create` — automate on push, PR, release events

### Global Flags
*   `--format json`: Produces machine-readable output for automation.
*   `-q` / `--quiet`: Limits output to IDs only.

### Extensions & Skills
*   **Extensions:** Extend CLI functionality via GitHub repositories using `hf extensions install REPO_ID`.
*   **Skills:** Manage AI assistant skills with `hf skills add`.
