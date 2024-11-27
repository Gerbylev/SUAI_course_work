from typing import List, Optional

from pydantic import StrictStr, StrictInt

from suai_project.endpoints.apis.subtask_api_base import BaseSubtaskApi
from suai_project.endpoints.models.create_subtask_data import CreateSubtaskData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.subtask_data import SubtaskData


class SubtaskEndpoint(BaseSubtaskApi):
    async def add_subtask(self, taskId: StrictStr, create_subtask_data: CreateSubtaskData,
                          token_BearerAuth: TokenModel) -> List[SubtaskData]:
        return await super().add_subtask(taskId, create_subtask_data, token_BearerAuth)

    async def delete_subtask(self, taskId: StrictStr, subtask_id: Optional[StrictInt], token_BearerAuth: TokenModel) -> \
    List[SubtaskData]:
        return await super().delete_subtask(taskId, subtask_id, token_BearerAuth)

    async def edit_subtask(self, taskId: StrictStr, subtask_data: SubtaskData, token_BearerAuth: TokenModel) -> List[
        SubtaskData]:
        return await super().edit_subtask(taskId, subtask_data, token_BearerAuth)

    async def get_subtask(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> List[SubtaskData]:
        return await super().get_subtask(taskId, token_BearerAuth)