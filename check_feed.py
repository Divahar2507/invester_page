
import requests

try:
    response = requests.get('http://127.0.0.1:8000/pitches/feed?skip=0&limit=50', timeout=5)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Data count: {len(data)}")
        if len(data) > 0:
            print("First item:", data[0])
    else:
        print("Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
