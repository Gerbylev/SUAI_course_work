from http import HTTPStatus
from typing import List, Optional

from pydantic import StrictStr, StrictInt

from suai_project.dao.subtask_dao import SubtaskDao
from suai_project.dao.task_dao import TaskDAO
from suai_project.endpoints.apis.subtask_api_base import BaseSubtaskApi
from suai_project.endpoints.models.create_subtask_data import CreateSubtaskData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.subtask_data import SubtaskData
from suai_project.services.account_service import get_account_with_raise
from suai_project.services.error_service import HandleWebException, ErrorResponse


class SubtaskEndpoint(BaseSubtaskApi):
    async def add_subtask(self, taskId: StrictStr, create_subtask_data: CreateSubtaskData,
                          token_BearerAuth: TokenModel) -> List[SubtaskData]:
        user = get_account_with_raise(token_BearerAuth)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task and task.user_id == user.id:
            subtask = SubtaskDao.add(**{"task_id": task.id, "text": create_subtask_data.text})
            subtasks = SubtaskDao.find_all(**{"task_id": task.id})
            subtasks = [SubtaskData(id=subtask.id, text=subtask.text) for subtask in subtasks]
            return subtasks
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))

    async def delete_subtask(self, taskId: StrictStr, subtask_id: Optional[StrictInt], token_BearerAuth: TokenModel) -> \
    List[SubtaskData]:
        user = get_account_with_raise(token_BearerAuth)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        subtask = SubtaskDao.find_one_or_none_by_id(subtask_id)
        if task  and subtask and task.user_id == user.id and subtask.task_id == task.id:
            subtask = SubtaskDao.delete(**{"id": subtask.id})
            subtasks = SubtaskDao.find_all(**{"task_id": task.id})
            subtasks = [SubtaskData(id=subtask.id, text=subtask.text) for subtask in subtasks]
            return subtasks
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))

    async def edit_subtask(self, taskId: StrictStr, subtask_data: SubtaskData, token_BearerAuth: TokenModel) -> List[
        SubtaskData]:
        user = get_account_with_raise(token_BearerAuth)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task and task.user_id == user.id:
            subtask = SubtaskDao.update({"id": subtask_data.id}, **{"text": subtask_data.text})
            subtasks = SubtaskDao.find_all(**{"task_id": task.id})
            subtasks = [SubtaskData(id=subtask.id, text=subtask.text) for subtask in subtasks]
            return subtasks
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))

    async def get_subtask(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> List[SubtaskData]:
        user = get_account_with_raise(token_BearerAuth)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task and task.user_id == user.id:
            subtasks = SubtaskDao.find_all(**{"task_id": task.id})
            subtasks = [SubtaskData(id=subtask.id, text=subtask.text) for subtask in subtasks]
            return subtasks
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))