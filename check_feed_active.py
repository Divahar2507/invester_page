
import requests

try:
    # Mimic the exact call: industry=All, stage=All, status=active, sortBy=newest
    # Note: 'All' in BrowsePitches means we don't send the param or backend handles 'All'.
    # Frontend logic:
    # if (industry && industry !== 'All') url += ...
    
    # So if All, we don't send industry/stage.
    
    url = 'http://127.0.0.1:8000/pitches/feed?skip=0&limit=50&status=active&sort_by=newest'
    print(f"Fetching: {url}")
    
    response = requests.get(url, timeout=5)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Data count: {len(data)}")
        if len(data) > 0:
            print("First item title:", data[0]['title'])
            print("First item status:", data[0]['status'])
    else:
        print("Response:", response.text)

except Exception as e:
    print(f"Error: {e}")
