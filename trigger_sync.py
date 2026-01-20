
import requests

try:
    response = requests.post('http://127.0.0.1:8000/dev/sync', timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response:", response.json())
except Exception as e:
    print(f"Error: {e}")
