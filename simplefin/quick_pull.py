import requests
import base64
import datetime
import json
import sys
import os

ACCESS_FILE = 'simplefin_access_url.txt'

def get_transaction_data(setup_token=None):
    access_url = None
    
    # 1. Try to load Access URL from file
    if os.path.exists(ACCESS_FILE):
        try:
            with open(ACCESS_FILE, 'r') as f:
                access_url = f.read().strip()
            print(f"Loaded Access URL from {ACCESS_FILE}")
        except Exception as e:
            print(f"Error reading access file: {e}")

    # 2. If no Access URL, expect Setup Token to claim one
    if not access_url:
        if not setup_token:
            print("No stored Access URL found.")
            setup_token = input('Setup Token? ')
        
        if not setup_token:
            print("No Setup Token provided. Exiting.")
            return

        # Decode base64 setup token
        try:
            claim_url = base64.b64decode(setup_token).decode('utf-8')
        except Exception as e:
            print(f"Error decoding token: {e}")
            return

        print(f"Claiming access from: {claim_url}")
        
        try:
            response = requests.post(claim_url)
            response.raise_for_status()
            access_url = response.text
            
            # Save it!
            with open(ACCESS_FILE, 'w') as f:
                f.write(access_url)
            print(f"Access URL claimed and saved to {ACCESS_FILE}")
            
        except requests.exceptions.HTTPError as e:
            print(f"Failed to claim token: {e.response.text}")
            return
        except Exception as e:
            print(f"Error requesting access url: {e}")
            return

    # 3. Get some data
    # format: scheme://username:password@domain/path...
    try:
        scheme, rest = access_url.split('//', 1)
        auth, rest = rest.split('@', 1)
        url = scheme + '//' + rest + '/accounts'
        username, password = auth.split(':', 1)
    except ValueError:
        print(f"Error parsing access URL. It might be invalid/corrupt.")
        return

    print(f"Fetching accounts from: {url}")
    
    try:
        response = requests.get(url, auth=(username, password))
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    # Output results
    def ts_to_datetime(ts):
        return datetime.datetime.fromtimestamp(ts)

    if 'accounts' in data:
        for account in data['accounts']:
            # Convert timestamp for display
            display_account = account.copy()
            display_account['balance-date'] = ts_to_datetime(account['balance-date'])
            print(f"\n{display_account['balance-date']} {display_account['balance']:>8} {display_account['name']}")
            print('-'*60)
            for transaction in account.get('transactions', []):
                transaction['posted'] = ts_to_datetime(transaction['posted'])
                print(f"{transaction['posted']} {transaction['amount']:>8} {transaction['description']}")
    else:
        print("No accounts data found or error in response.")
        print(json.dumps(data, indent=2))

if __name__ == "__main__":
    # Allow passing token as command line argument
    token = sys.argv[1] if len(sys.argv) > 1 else None
    
    get_transaction_data(token)
