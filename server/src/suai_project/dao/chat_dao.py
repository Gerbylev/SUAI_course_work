from sqlalchemy import select

from suai_project.dao.base import BaseDAO
from suai_project.models.models import Chat
from suai_project.services.database import Session


class ChatDao(BaseDAO):
    model = Chat

    @classmethod
    def find_by_task_and_user(cls, user_id: int, task_id):
        with Session() as session:
            query = select(cls.model).filter_by(user_id=user_id).filter_by(task_id=task_id)
            chats = session.execute(query).scalars().all()
            return chats