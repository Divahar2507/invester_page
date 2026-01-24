import json
import os
from groq import Groq
from ..config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

async def create_chat_completion(prompt: str):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a B2B go-to-market strategist. Always respond with ONLY valid JSON and no extra commentary.",
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.1-8b-instant",
        max_tokens=700,
        temperature=0.7,
    )
    return chat_completion

def extract_json(text: str):
    import re
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in model response")
    return json.loads(match.group(0))
