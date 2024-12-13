import json
from http import HTTPStatus
from typing import List

from fastapi import HTTPException
from pydantic import StrictStr

from suai_project.dao.chat_dao import ChatDao
from suai_project.dao.task_dao import TaskDAO
from suai_project.endpoints.apis.chat_api_base import BaseChatApi
from suai_project.endpoints.models.chat_data import ChatData
from suai_project.endpoints.models.chats_data import ChatsData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.message_data import MessageData
from suai_project.endpoints.models.prompt_data import PromptData
from suai_project.services.LLMService import LLMService
from suai_project.services.account_service import get_account_with_raise
from suai_project.services.error_service import HandleWebException, ErrorResponse
from suai_project.utils.generate_token import generate_key


class ChatEndpoint(BaseChatApi):

    def __init__(self):
        self.chat_service = LLMService()

    async def chat(self, taskId: StrictStr, chatId: StrictStr, prompt_data: PromptData, token_BearerAuth: TokenModel) -> \
    ChatData:
        user = get_account_with_raise(token_BearerAuth)
        chat = ChatDao.find_one_or_none_by_id(chatId)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task is None:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Task doesn't exist",
            )
        # try:
        if chat and chat.user_id == user.id and chat.task_id == taskId:
            messages = json.loads(chat.chat_history)
            messages = [MessageData(**json.loads(message)) for message in messages]
            messages.append(MessageData(role="user", content=prompt_data.prompt))
            response = await self.chat_service.chat_controller(messages[:5], task.task)
            messages.append(response)
            json_history = [message.to_json() for message in messages]
            json_history = json.dumps(json_history, ensure_ascii=False)
            ChatDao.update(filter_by={"id": chat.id}, **{"chat_history": json_history})
            # TODO generate answer
            # TODO update message
            return ChatData(id=chat.id, summary=chat.title, messages=messages)
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))
        # except:
        #     raise HandleWebException(
        #         ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))

    async def get_chat(self, taskId: StrictStr, chatId: StrictStr, token_BearerAuth: TokenModel) -> ChatData:
        user = get_account_with_raise(token_BearerAuth)
        chat = ChatDao.find_one_or_none_by_id(chatId)
        try:
            if chat and chat.user_id == user.id and chat.task_id == taskId:
                messages = json.loads(chat.chat_history)
                messages = [MessageData(**json.loads(message)) for message in messages]
                return ChatData(id=chat.id, summary=chat.title, messages=messages)
            else:
                raise HandleWebException(ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))
        except:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))

    async def get_chats(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> List[ChatsData]:
        user = get_account_with_raise(token_BearerAuth)
        chats = ChatDao.find_by_task_and_user(user.id, taskId)
        sorted_chats = sorted(chats, key=lambda chat: chat.created_at)
        chats_data = [ChatsData(id=chat.id, summary=chat.title) for chat in sorted_chats]
        return chats_data

    async def create_chats(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> ChatData:
        user = get_account_with_raise(token_BearerAuth)
        chat_id = generate_key(30)
        chat = ChatDao.add(**{"id": chat_id, "user_id": user.id,
        "task_id": taskId, "title": "", "chat_history": "[]"})
        return ChatData(id= chat_id, summary = "", messages = [])

