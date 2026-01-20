
import requests

try:
    url = 'http://127.0.0.1:8000/pitches/feed?skip=0&limit=5'
    response = requests.get(url, timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"Data count: {len(data)}")
        for i, item in enumerate(data):
            print(f"Item {i} status: '{item.get('status')}'")
    else:
        print("Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
