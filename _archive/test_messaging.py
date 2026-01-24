import requests
import sys

BASE_URL = "http://localhost:8000"

def login(email, password):
    print(f"Logging in as {email}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code} {resp.text}")
            # Try /api/v1/auth/login just in case
            resp = requests.post(f"{BASE_URL}/api/v1/auth/login", json={"email": email, "password": password})
            if resp.status_code != 200:
                print(f"Login failed on /api/v1 too: {resp.status_code} {resp.text}")
                return None
            else:
                print("Login successful on /api/v1/auth/login")
                return resp.json()["access_token"]
        print("Login successful on /auth/login")
        return resp.json()["access_token"]
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def send_message(token, receiver_id, content):
    print(f"Sending message to {receiver_id}...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "receiver_id": receiver_id,
        "content": content
    }
    
    # Try /messages/send
    url = f"{BASE_URL}/messages/send"
    print(f"Trying POST {url}")
    resp = requests.post(url, headers=headers, data=data) # form-data
    print(f"Response: {resp.status_code} {resp.text}")
    
    if resp.status_code == 404:
        # Try /api/v1/messaging/send
        url = f"{BASE_URL}/api/v1/messaging/send"
        print(f"Trying POST {url} (fallback)")
        resp = requests.post(url, headers=headers, data=data)
        print(f"Response: {resp.status_code} {resp.text[:200]}")

def main():
    token = login("startup@test.com", "password")
    if not token:
        return

    # Assuming investor user has ID 1 or something.
    # We can try to get conversations or search or just guess.
    # Usually seed creates investor first (ID 1) then startup (ID 2).
    send_message(token, 1, "Hello from script!")

if __name__ == "__main__":
    main()
