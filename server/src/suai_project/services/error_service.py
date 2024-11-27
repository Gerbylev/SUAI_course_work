from typing import Optional

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from starlette.responses import JSONResponse


class ErrorResponse(BaseModel):
    error_message: str
    status_code: int
    detail: Optional[list[dict[str, str]]] = None

class HandleWebException(Exception):
    def __init__(self, error_response: ErrorResponse):
        self.error_response = error_response


async def custom_exception_handler(request, exc: HandleWebException):
    error_status = exc.error_response.status_code
    del exc.error_response.status_code
    return JSONResponse(
        status_code=error_status,
        content=jsonable_encoder(exc.error_response),
    )

async def generic_exception_handler(request, exc: Exception):
    error_response = ErrorResponse(
        error_message="Internal Server Error",
        status_code=500,
    )
    return JSONResponse(
        status_code=500,
        content=jsonable_encoder(error_response),
    )