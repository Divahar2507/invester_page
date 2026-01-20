import requests
import json

url = "http://localhost:8000/auth/register"
data = {
    "email": "prithivitwts@gmail.com",
    "password": "password123",
    "role": "startup",
    "full_name": "1-StriketechAI"
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
