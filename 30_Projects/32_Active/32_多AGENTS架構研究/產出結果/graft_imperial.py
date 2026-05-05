import json
import os
from pathlib import Path

# --- Configuration Paths ---
OPENCLAW_CONFIG = Path.home() / ".openclaw" / "openclaw.json"
MANIFEST_FILE = Path("產出結果/agents_manifest.json")
WORKSPACE_BASE = Path.home() / ".openclaw"

def load_manifest():
    with open(MANIFEST_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def update_openclaw_config(manifest):
    if not OPENCLAW_CONFIG.exists():
        print(f"Error: OpenClaw config not found at {OPENCLAW_CONFIG}")
        return

    with open(OPENCLAW_CONFIG, 'r', encoding='utf-8') as f:
        config = json.load(f)

    # Backup original config
    backup_path = OPENCLAW_CONFIG.with_suffix(".json.bak")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print(f"Backup created at {backup_path}")

    # Merge agents
    existing_agents = {a['id']: a for a in config.get('agents', {}).get('list', [])}
    
    for new_agent in manifest['agents']:
        agent_id = new_agent['id']
        # Convert simple manifest format to OpenClaw format
        oc_agent = {
            "id": agent_id,
            "name": new_agent['name'],
            "workspace": new_agent['workspace'],
            "description": new_agent['description']
        }
        # Avoid duplicates, prioritize new manifest
        existing_agents[agent_id] = oc_agent

    config.setdefault('agents', {})['list'] = list(existing_agents.values())

    with open(OPENCLAW_CONFIG, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    print("OpenClaw configuration updated successfully.")

def create_workspaces(manifest):
    for agent in manifest['agents']:
        # Resolve the ~ to home directory
        ws_path = Path(os.path.expanduser(agent['workspace']))
        ws_path.mkdir(parents=True, exist_ok=True)
        
        # Create standard files
        (ws_path / "IDENTITY.md").write_text(f"# Identity: {agent['name']}\n\n{agent['description']}", encoding='utf-8')
        (ws_path / "SOUL.md").write_text(f"# Soul: {agent['name']}\n\nRole: {', '.join(agent['roles'])}\n\n[Personality Instructions Here]", encoding='utf-8')
        (ws_path / "USER.md").write_text("# User: Navi\n\n[User Preferences Here]", encoding='utf-8')
        (ws_path / "AGENTS.md").write_text("# Agents Registry\n\n[Peer Discovery Data Here]", encoding='utf-8')
        
        print(f"Initialized workspace for {agent['id']} at {ws_path}")

if __name__ == "__main__":
    try:
        manifest_data = load_manifest()
        update_openclaw_config(manifest_data)
        create_workspaces(manifest_data)
        print("\n--- NAVI IMPERIAL DEPLOYMENT COMPLETE ---")
    except Exception as e:
        print(f"Error during deployment: {e}")
