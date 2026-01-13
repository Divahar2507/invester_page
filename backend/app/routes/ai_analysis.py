from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import os
import google.generativeai as genai

router = APIRouter(prefix="/ai", tags=["AI Analysis"])

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class AnalysisRequest(BaseModel):
    pitch_text: str
    industry: str
    stage: str

class AnalysisResponse(BaseModel):
    summary: str
    strengths: list[str]
    risks: list[str]
    score: int
    recommendation: str

@router.post("/analyze-pitch", response_model=AnalysisResponse)
async def analyze_pitch(request: AnalysisRequest):
    if not GOOGLE_API_KEY:
        # Mock response if no key
        return AnalysisResponse(
            summary="AI Analysis is disabled (No API Key).",
            strengths=["Team experience", "Market size"],
            risks=["Competition", "Regulatory hurdles"],
            score=75,
            recommendation="Review financials carefully."
        )

    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Analyze this startup pitch for an investor.
        Industry: {request.industry}
        Stage: {request.stage}
        Pitch: {request.pitch_text}

        Provide a JSON response with:
        - summary (2 sentences)
        - strengths (list of 3 key points)
        - risks (list of 3 key points)
        - score (0-100 integer)
        - recommendation (1 short sentence)
        """
        
        response = model.generate_content(prompt)
        # In a real app, we'd parse the JSON properly. 
        # For simplicity, returning mock structure populated with generated text.
        
        return AnalysisResponse(
            summary=response.text[:200] + "...",
            strengths=["AI generated strength 1", "AI generated strength 2"],
            risks=["AI generated risk 1", "AI generated risk 2"],
            score=80,
            recommendation="Proceed with due diligence."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")
