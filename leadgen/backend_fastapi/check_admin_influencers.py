import httpx
import asyncio

async def test_list_influencers():
    url = "http://localhost:4000/api/influencers/"
    
    print(f"Sending GET to {url}...")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            print(f"Status Code: {resp.status_code}")
            # print(f"Response: {resp.text}")
            if resp.status_code == 200:
                data = resp.json()
                print(f"Found {len(data)} influencers.")
                if len(data) > 0:
                    print(f"First influencer charge: {data[0].get('charge_per_post')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_list_influencers())
