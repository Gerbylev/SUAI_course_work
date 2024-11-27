from sqlalchemy import select

from suai_project.dao.base import BaseDAO
from suai_project.models.models import AuthToken
from suai_project.services.database import Session


class AuthTaskDAO(BaseDAO):
    model = AuthToken

    @classmethod
    def find_one_or_none_by_token(cls, token: str):
        with Session() as session:
            query = select(cls.model).filter_by(token=token)
            return session.execute(query).scalar_one_or_none()