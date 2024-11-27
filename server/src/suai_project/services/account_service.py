from http import HTTPStatus

from fastapi import HTTPException
from sqlalchemy.testing.suite.test_reflection import users

from suai_project.dao.auth_token_dao import AuthTaskDAO
from suai_project.dao.user_dao import UserDAO
from suai_project.endpoints.models.extra_models import TokenModel


def check_permission(token: TokenModel, expected_id: int):
    user = get_account_with_raise(token)
    if user.id != expected_id:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="You don't have permission",
        )


def get_account_with_raise(token: TokenModel) -> UserDAO:
    user = get_account(token)
    if user is None:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid token",
        )
    return user

def get_account(token: TokenModel) -> UserDAO:
    user = UserDAO.find_by_token(token.sub)
    return user