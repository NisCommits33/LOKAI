from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

from services.supabase_service import supabase_service
from services.ocr_service import ocr_service
from services.ai_service import ai_service
from pydantic import BaseModel

app = FastAPI(title="LOKAI AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    document_id: str
    file_path: str
    organization_name: str

@app.post("/process-document")
async def process_document(request: ProcessRequest):
    try:
        # 1. Update status to processing
        supabase_service.update_document(request.document_id, {"processing_status": "processing"})
        
        # 2. Download file
        local_path = supabase_service.download_file("documents", request.file_path)
        
        # 3. Extract Text (OCR)
        ocr_result = ocr_service.extract_text(local_path)
        text = ocr_result["text"]
        
        # 4. Generate AI Summary & Key Points
        ai_data = await ai_service.summarize_document(text)
        
        # 5. Generate Questions
        questions_raw = await ai_service.generate_questions(text, request.organization_name)
        
        # 6. Format and save questions
        formatted_questions = []
        for q in questions_raw:
            formatted_questions.append({
                "document_id": request.document_id,
                "question_text": q.get("question_text"),
                "options": q.get("options"),
                "correct_index": q.get("correct_index"),
                "explanation": q.get("explanation"),
                "difficulty": q.get("difficulty", "medium")
            })
            
        if formatted_questions:
            supabase_service.insert_questions(formatted_questions)

        # 7. Final Update
        supabase_service.update_document(request.document_id, {
            "extracted_text": text,
            "page_count": ocr_result["page_count"],
            "ai_summary": ai_data.get("summary"),
            "key_points": ai_data.get("key_points"),
            "processing_status": "completed",
            "processed_at": "now()"
        })

        # Cleanup
        os.remove(local_path)
        
        return {"status": "success", "document_id": request.document_id}
        
    except Exception as e:
        supabase_service.update_document(request.document_id, {"processing_status": "failed"})
        return {"status": "error", "message": str(e)}

@app.get("/")
async def root():
    return {"message": "LOKAI AI API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
