from datetime import date
from typing import Optional, List

from sqlalchemy import and_, select

from suai_project.dao.base import BaseDAO
from suai_project.dao.user_dao import UserDAO
from suai_project.endpoints.models.task_data import TaskData
from suai_project.models.models import Task, User
from suai_project.services.database import Session


class TaskDAO(BaseDAO):
    model = Task

    @classmethod
    def to_api(cls, task_dao_data)-> TaskData:
        return TaskData(
            id = task_dao_data.id,
            title = task_dao_data.title,
            task = task_dao_data.task,
            author = UserDAO.find_one_or_none_by_id(task_dao_data.user_id).full_name,
            solved = "Не решено",  # TODO
            is_analyzed = False    # TODO
        )

    @classmethod
    def find_all(cls, title: Optional[str] = None,
                 start_date: Optional[date] = None,
                 end_date: Optional[date] = None,
                 author_name: Optional[str] = None,
                 status: Optional[str] = None,
                 page: int = 1,
                 limit: int = 10) -> List[Task]:

        with Session() as session:
            query = select(cls.model)
            conditions = []

            if title:
                conditions.append(cls.model.title.ilike(f'%{title}%'))
            if start_date:
                conditions.append(cls.model.created_at >= start_date)
            if end_date:
                conditions.append(cls.model.created_at <= end_date)

            if author_name:
                user_query = select(User).filter(User.full_name.ilike(f'%{author_name}%'))
                users = session.execute(user_query)
                user_ids = [user.id for user in users.scalars().all()]
                conditions.append(cls.model.user_id.in_(user_ids))

            if conditions:
                query = query.where(and_(*conditions))

            offset = (page - 1) * limit
            query = query.offset(offset).limit(limit)

            result = session.execute(query)
            return result.scalars().all()