import os
import google.generativeai as genai
from typing import List, Dict, Any
import json

class AIService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def summarize_document(self, text: str) -> Dict[str, Any]:
        prompt = f"""
        You are an expert in Nepal Government policies and regulations.
        Analyze the following text from a government document and provide:
        1. A concise professional summary (approx 200 words).
        2. A list of 5-8 key strategic points or rules defined in the text.
        
        Format the output as a JSON object with keys: "summary" (string) and "key_points" (list of strings).
        
        TEXT:
        {text[:10000]} # Limiting input for safety
        """
        
        response = await self.model.generate_content_async(prompt)
        try:
            # Simple cleanup of possible markdown backticks
            result_text = response.text.strip()
            if result_text.startswith("```json"):
                result_text = result_text[7:-3].strip()
            return json.loads(result_text)
        except Exception as e:
            return {
                "summary": response.text[:500],
                "key_points": []
            }

    async def generate_questions(self, text: str, organization: str) -> List[Dict[str, Any]]:
        prompt = f"""
        Generate 10 multiple-choice questions (MCQs) for government exam preparation based on the following text.
        Organization context: {organization}
        
        Each question must have:
        - question_text
        - options (list of 4 strings)
        - correct_index (0-3)
        - explanation (why it's correct)
        - difficulty (easy, medium, hard)
        
        Format as a JSON array of objects.
        
        TEXT:
        {text[:8000]}
        """
        
        response = await self.model.generate_content_async(prompt)
        try:
            result_text = response.text.strip()
            if result_text.startswith("```json"):
                result_text = result_text[7:-3].strip()
            return json.loads(result_text)
        except:
            return []

ai_service = AIService()
