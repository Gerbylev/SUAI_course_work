import asyncio
from hashlib import sha256

from fastapi import APIRouter, UploadFile, HTTPException, Security
from fastapi.responses import FileResponse
import os
import zipfile
from pathlib import Path

from suai_project.dao.solution_details_dao import SolutionDetailsDAO
from suai_project.dao.solved_dao import SolvedDAO
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.security_api import get_token_BearerAuth
from suai_project.models.models import User
from suai_project.services.WorkService import WorkService
from suai_project.services.account_service import get_account_with_raise

router = APIRouter()

BASE_DIR = Path("uploaded_files")
BASE_DIR.mkdir(exist_ok=True)

@router.post("/api/solution/{task_id}/file")
async def upload_and_extract_zip(task_id: str, file: UploadFile, token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    )):
    work_service = WorkService()
    """Загрузка и распаковка zip-файла по определённому пути."""
    user: User = get_account_with_raise(token_BearerAuth)
    if file.content_type != "application/zip":
        raise HTTPException(status_code=400, detail="Uploaded file must be a zip archive")

    unique_id = sha256(f"{user.id}{task_id}".encode()).hexdigest()
    task_dir = BASE_DIR / unique_id
    task_dir.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(file.file, 'r') as zip_ref:
            zip_ref.extractall(task_dir)
        existing_record = SolvedDAO.find_one_or_none_by_id(unique_id)

        if existing_record:
            SolvedDAO.update(filter_by={"id": unique_id}, **{"status": "analyze"})
            SolutionDetailsDAO.delete(delete_all=False, **{"solved_id": unique_id})
        else:
            SolvedDAO.add(**{"id": unique_id, "user_id": user.id, "task_id": task_id, "status": "analyze"})
        asyncio.create_task(work_service.check_work(task_dir, task_id, unique_id))
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid zip file")

@router.get("/api/solution/{task_id}/file")
async def get_task_as_zip(task_id: str, token_BearerAuth: TokenModel = Security(
        get_token_BearerAuth
    )):
    user = get_account_with_raise(token_BearerAuth)

    unique_id = sha256(f"{user.id}{task_id}".encode()).hexdigest()
    task_dir = BASE_DIR / unique_id

    if not task_dir.exists() or not task_dir.is_dir():
        raise HTTPException(status_code=404, detail="Task not found")

    zip_path = task_dir / f"{unique_id}.zip"

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(task_dir):
            for file in files:
                if file != zip_path.name:
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(task_dir)
                    zipf.write(file_path, arcname)

    return FileResponse(zip_path, media_type="application/zip", filename=f"{task_id}.zip")
