from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

class LokAIException(Exception):
    """Base exception for LokAI AI Service"""
    def __init__(self, message: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, detail: any = None):
        self.message = message
        self.status_code = status_code
        self.detail = detail

async def lokai_exception_handler(request: Request, exc: LokAIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "detail": exc.detail,
            "type": exc.__class__.__name__
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": True,
            "message": "Validation Error",
            "detail": exc.errors(),
            "type": "ValidationError"
        },
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": str(exc.detail),
            "detail": None,
            "type": "HTTPException"
        },
    )

async def generic_exception_handler(request: Request, exc: Exception):
    # In production, log the full stack trace here
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "message": "An internal server error occurred",
            "detail": str(exc) if True else None, # Set to False in production
            "type": exc.__class__.__name__
        },
    )
