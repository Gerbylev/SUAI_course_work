from sqlalchemy import select

from suai_project.dao.base import BaseDAO
from suai_project.models.models import User, AuthToken
from suai_project.services.database import Session


class UserDAO(BaseDAO):
    model = User

    @classmethod
    def find_by_username(cls, username: str):
        with Session() as session:
            query = select(cls.model).filter_by(username=username)
            return session.execute(query).scalar_one_or_none()

    @classmethod
    def find_by_token(cls, token: str):
        with Session() as session:
            query = select(AuthToken).filter_by(token=token)
            auth_token = session.execute(query).scalar_one_or_none()
            if auth_token:
                user_query = select(cls.model).filter_by(id=auth_token.user_id)
                return session.execute(user_query).scalar_one_or_none()
            return None