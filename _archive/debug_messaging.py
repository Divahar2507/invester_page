import requests
import sys

BASE_URL = "http://localhost:8000"

def login(email, password):
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        if resp.status_code != 200:
            return None
        return resp.json()["access_token"]
    except Exception:
        return None

def main():
    token = login("startup@test.com", "password")
    if not token:
        print("Login failed")
        return

    headers = {"Authorization": f"Bearer {token}"}
    # Trying to send to ID 1
    data = {
        "receiver_id": 1,
        "content": "Hello from debug script!"
    }
    
    url = f"{BASE_URL}/messages/send"
    resp = requests.post(url, headers=headers, data=data)
    
    with open("debug_response.txt", "w") as f:
        f.write(f"Status: {resp.status_code}\n")
        f.write(f"Body: {resp.text}\n")
    print("Response written to debug_response.txt")

if __name__ == "__main__":
    main()
