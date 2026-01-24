import asyncio
import os
import sys

# Add the app directory to path
sys.path.insert(0, 'c:/Users/divah/OneDrive/Desktop/business_develop/leadgen/leadgen/backend_fastapi')

from app.config import settings

async def test_groq_config():
    """Test if Groq API key is configured"""
    print("=" * 60)
    print("LEADGEN GROQ API CONFIGURATION TEST")
    print("=" * 60)
    
    # Check if API key is set
    if settings.GROQ_API_KEY:
        print("✅ GROQ_API_KEY is configured")
        print(f"   Key length: {len(settings.GROQ_API_KEY)} characters")
        print(f"   Key preview: {settings.GROQ_API_KEY[:10]}..." if len(settings.GROQ_API_KEY) > 10 else f"   Key: {settings.GROQ_API_KEY}")
    else:
        print("❌ GROQ_API_KEY is NOT configured")
        print("   This is why pain points are not auto-generating!")
        print("\n📋 To fix:")
        print("   1. Get API key from: https://console.groq.com/")
        print("   2. Add to .env file: GROQ_API_KEY=your_key_here")
        print("   3. Restart backend: docker-compose restart backend-leadgen")
        return False
    
    print("\n" + "=" * 60)
    print("Testing Groq API Connection...")
    print("=" * 60)
    
    try:
        from app.services.groq_service import create_chat_completion
        
        # Simple test prompt
        prompt = "Return this exact JSON: {\"test\": \"success\"}"
        print(f"\n📤 Sending test prompt to Groq...")
        
        completion = await create_chat_completion(prompt)
        response_text = completion.choices[0].message.content
        
        print(f"✅ Groq API responded successfully!")
        print(f"   Response: {response_text[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Groq API call failed:")
        print(f"   Error: {str(e)}")
        print("\n   Possible reasons:")
        print("   - Invalid API key")
        print("   - Network/connectivity issue")
        print("   - Groq service is down")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_groq_config())
    
    print("\n" + "=" * 60)
    if success:
        print("RESULT: ✅ System is configured correctly for pain point generation")
    else:
        print("RESULT: ❌ Configuration issue detected - pain points will NOT generate")
    print("=" * 60)
    
    sys.exit(0 if success else 1)
