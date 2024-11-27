from typing import List

from pydantic import StrictStr

from suai_project.endpoints.apis.chat_api_base import BaseChatApi
from suai_project.endpoints.models.chat_data import ChatData
from suai_project.endpoints.models.chats_data import ChatsData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.prompt_data import PromptData


class ChatEndpoint(BaseChatApi):
    async def chat(self, taskId: StrictStr, chatId: StrictStr, prompt_data: PromptData, token_BearerAuth: TokenModel) -> \
    List[ChatData]:
        return await super().chat(taskId, chatId, prompt_data, token_BearerAuth)

    async def get_chat(self, taskId: StrictStr, chatId: StrictStr, token_BearerAuth: TokenModel) -> List[ChatData]:
        return await super().get_chat(taskId, chatId, token_BearerAuth)

    async def get_chats(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> List[ChatsData]:
        return await super().get_chats(taskId, token_BearerAuth)