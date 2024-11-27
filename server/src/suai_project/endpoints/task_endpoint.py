from datetime import date
from http import HTTPStatus
from typing import List, Optional, Union, Tuple
from typing_extensions import Annotated

from fastapi import HTTPException
from pydantic import StrictStr, StrictInt, Field, StrictBytes

from suai_project.dao.task_dao import TaskDAO
from suai_project.endpoints.apis.task_api_base import BaseTaskApi
from suai_project.endpoints.models.account_data import AccountData
from suai_project.endpoints.models.create_task_data import CreateTaskData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.task_data import TaskData

from suai_project.endpoints.validation.Validator import Validator
from suai_project.services.account_service import get_account, get_account_with_raise, check_permission
from suai_project.utils.generate_token import generate_key


class TaskEndpoint(BaseTaskApi):

    async def create_task(self, task_data: Optional[CreateTaskData],
                          notebooks: Optional[List[Union[StrictBytes, StrictStr, Tuple[StrictStr, StrictBytes]]]],
                          token_BearerAuth: TokenModel) -> AccountData:
        user = get_account_with_raise(token_BearerAuth)
        validator = Validator(task_data)
        validator.length("title", min_len=0, max_len=526)
        validator.length("task", min_len=100, max_len=10000)
        validator.check()
        task_id = generate_key(60)
        task = TaskDAO.add(**{**task_data.to_dict(), "user_id": user.id, "id": task_id})
        task = TaskDAO.to_api(task)
        # TODO надо запускать обработку задания
        return task

    async def edit_task(self, taskId: StrictStr, task_data: Optional[CreateTaskData],
                        notebooks: Optional[List[Union[StrictBytes, StrictStr, Tuple[StrictStr, StrictBytes]]]],
                        token_BearerAuth: TokenModel) -> TaskData:
        validator = Validator(task_data)
        validator.length("title", min_len=0, max_len=526)
        validator.length("task", min_len=100, max_len=10000)
        validator.check()
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Task doesn't exist",
            )
        check_permission(token_BearerAuth, task.user_id)
        task = TaskDAO.update(filter_by={"id": taskId}, **task_data.to_dict())
        # TODO надо запускать обработку задания
        return TaskDAO.to_api(task)

    async def delete_task(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> None:
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Task doesn't exist",
            )
        check_permission(token_BearerAuth, task.user_id)
        TaskDAO.delete(**{"id":task.id})

    async def get_task(self, taskId: StrictStr) -> TaskData:
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Task doesn't exist",
            )
        return TaskDAO.to_api(task)

    async def get_all_tasks(self, page: Optional[StrictInt] = 1, limit: Optional[StrictInt] = 10, title: Optional[StrictStr] = None,
                            start_date: Optional[date] = None, end_date: Optional[date] = None, author_name: Optional[StrictStr] = None,
                            status: Optional[StrictStr] = None) -> List[TaskData]:
        page = page or 1
        limit = limit or 10

        if start_date and end_date and end_date < start_date:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="end_date must be greater than start_date"
            )

        tasks = TaskDAO.find_all(
            title=title,
            start_date=start_date,
            end_date=end_date,
            author_name=author_name,
            status=status,
            page=page,
            limit=limit
        )

        return [TaskDAO.to_api(task) for task in tasks]



