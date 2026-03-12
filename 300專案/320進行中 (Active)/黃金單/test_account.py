import os
import requests

TOKEN = os.getenv('MT5_TOKEN')
ACCOUNT_ID = os.getenv('MT5_ACCOUNT_ID', "3d39912e-4ab7-419f-96f3-c1ca5cd19ae1")
REGION = os.getenv('MT5_REGION', "new-york")

if not TOKEN and os.path.exists('.env'):
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                if k == 'MT5_TOKEN': TOKEN = v
                if k == 'MT5_ACCOUNT_ID': ACCOUNT_ID = v
                if k == 'MT5_REGION': REGION = v

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

headers = {"auth-token": TOKEN}
# Try Provisioning API to list accounts
url = f"https://mt-provisioning-api-v1.metaapi.cloud/users/current/accounts"
response = requests.get(url, headers=headers, verify=False)

if response.status_code == 200:
    accounts = response.json()
    print(f"✅ Found {len(accounts)} accounts.")
    for acc in accounts:
        print(f"ID: {acc.get('_id')}, Name: {acc.get('name')}, State: {acc.get('state')}, Region: {acc.get('region')}")
else:
    print(f"❌ Failed to list accounts: {response.status_code} - {response.text}")
