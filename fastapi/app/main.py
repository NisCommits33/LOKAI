from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from app.core.exceptions import (
    lokai_exception_handler, 
    validation_exception_handler, 
    http_exception_handler, 
    generic_exception_handler,
    LokAIException
)
# These will be created in the next steps
# from app.core.config import settings
# from app.routers import ocr, summarize, questions

app = FastAPI(
    title="LokAI AI Service",
    description="AI microservice for OCR, summarization, and question generation",
    version="1.0.0"
)

# Register Exception Handlers
app.add_exception_handler(LokAIException, lokai_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Default development URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder routers - to be implemented
# app.include_router(ocr.router, prefix="/api/ai/ocr", tags=["OCR"])
# app.include_router(summarize.router, prefix="/api/ai/summarize", tags=["Summarization"])
# app.include_router(questions.router, prefix="/api/ai/questions", tags=["Question Generation"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "LokAI AI"}
