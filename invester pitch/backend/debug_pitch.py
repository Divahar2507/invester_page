import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000"

def request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.load(res)
    except urllib.error.HTTPError as e:
        return e.code, json.load(e)
    except Exception as e:
        print(f"Error: {e}")
        return 500, {}

# 1. Register
email = "debug_pitch_final@test.com"
pwd = "password123"
print("Registering...")
status, body = request("POST", "/auth/register", {
    "email": email, "password": pwd, "role": "startup", "full_name": "Debug"
})
# Ignore if exists

# Login
print("Logging in...")
status, body = request("POST", "/auth/login", {"email": email, "password": pwd})
if status != 200:
    print("Login failed", body)
    sys.exit(1)
token = body["access_token"]

# 2. Create Pitch
print("Creating Pitch...")
payload = {
    "title": "Debug Pitch",
    "description": "Debug Desc",
    "raising_amount": "1000000",
    "equity_percentage": "10.5",
    "valuation": "10M",
    "location": "Chennai",
    "tags": "Tag1, Tag2"
}

status, body = request("POST", "/pitches/", payload, token)
print(f"Status: {status}")
print(f"Body: {json.dumps(body, indent=2)}")
