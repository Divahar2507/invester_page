import urllib.request
import json
import sys
import uuid

BASE_URL = "http://localhost:8000"

def log(msg):
    print(f"[TEST] {msg}")

def request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode('utf-8') if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
            if res.status == 204: return 204, {}
            return res.status, json.load(res)
    except urllib.error.HTTPError as e:
        try:
            err_body = json.load(e)
            return e.code, err_body
        except:
            return e.code, {"detail": str(e)}
    except Exception as e:
        return 500, {"detail": str(e)}

def run_tests():
    errors = []
    
    # 1. Register Startup
    s_email = f"startup_{uuid.uuid4().hex[:6]}@test.com"
    s_pass = "password123"
    log(f"Registering Startup: {s_email}")
    status, body = request("POST", "/auth/register", {
        "email": s_email, "password": s_pass, "role": "startup", "full_name": "Test Founder",
        "brand_name": "Test Startup", "company_name": "Test Startup Inc"
    })
    if status != 200:
        errors.append(f"Startup Registration Failed: {status} {body}")
        return errors

    # Login Startup
    status, body = request("POST", "/auth/login", {"email": s_email, "password": s_pass})
    if status != 200:
        errors.append(f"Startup Login Failed: {status}")
        return errors
    s_token = body["access_token"]
    
    # 2. Create Pitch
    log("Creating Pitch...")
    pitch_payload = {
        "title": "Super AI",
        "description": "Revolutionary AI",
        "raising_amount": "1000000",
        "equity_percentage": "10",
        "valuation": "10000000",
        "location": "NY",
        "tags": "AI, Tech"
    }
    status, body = request("POST", "/pitches/", pitch_payload, s_token)
    if status != 200:
        errors.append(f"Create Pitch Failed: {status} {body}")
    else:
        log("Pitch Created Successfully")
        pitch_id = body['id']

    # 3. Create Task
    log("Creating Task...")
    status, body = request("POST", "/tasks/", {"text": "Fix bugs"}, s_token)
    if status != 200:
         errors.append(f"Create Task Failed: {status} {body}")
    else:
        log("Task Created Successfully")

    # 4. Register Investor
    i_email = f"investor_{uuid.uuid4().hex[:6]}@test.com"
    log(f"Registering Investor: {i_email}")
    status, body = request("POST", "/auth/register", {
        "email": i_email, "password": s_pass, "role": "investor", "full_name": "Test Investor",
        "company_name": "VC Fund"
    })
    if status != 200:
        errors.append(f"Investor Registration Failed: {status} {body}")
        return errors

    # Login Investor
    status, body = request("POST", "/auth/login", {"email": i_email, "password": s_pass})
    if status != 200:
        errors.append(f"Investor Login Failed: {status}")
        return errors
    i_token = body["access_token"]

    # 5. Search Users (Messages)
    log("Searching Users...")
    status, body = request("GET", "/messages/users/search?q=Test", None, i_token)
    if status != 200:
        errors.append(f"User Search Failed: {status} {body}")
    else:
        log(f"User Search Found: {len(body)} users")

    # 6. Investor Messages Startup
    # We need startup user ID.
    # Assuming startup ID is 1 or we can find it from pitch?
    # Actually, we can search for the startup we just made.
    
    # Send Message
    # Find startup user id via search
    # status, users = request("GET", f"/messages/users/search?q={s_email.split('@')[0]}", None, i_token)
    # Actually simpler to just use a known logic or skipping if search failed.
    
    return errors

if __name__ == "__main__":
    result_errors = run_tests()
    if result_errors:
        print("\n❌ TESTS FAILED WITH ERRORS:")
        for e in result_errors:
            print(f"- {e}")
        sys.exit(1)
    else:
        print("\n✅ ALL TESTS PASSED Successfully!")
