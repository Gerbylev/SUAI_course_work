from http import HTTPStatus

from suai_project.dao.auth_token_dao import AuthTaskDAO
from suai_project.dao.user_dao import UserDAO
from suai_project.endpoints.apis.auth_api_base import BaseAuthApi
from suai_project.endpoints.models.login_data import LoginData
from suai_project.endpoints.models.register_data import RegisterData
from suai_project.endpoints.models.token_data import TokenData
from suai_project.endpoints.validation.Validator import Validator
from suai_project.services.error_service import HandleWebException, ErrorResponse
from suai_project.utils.generate_token import generate_key
from suai_project.utils.hash import hash_any


class AuthEndpoint(BaseAuthApi):

    async def login_user(self, login_data: LoginData) -> TokenData:
        cached_password = hash_any(login_data.password)
        user = UserDAO.find_by_username(login_data.username)
        if user and cached_password == user.password:
            token = generate_key(40)
            AuthTaskDAO.add(**{"user_id": user.id, "token": token})
            return TokenData(token=token)
        else:
            raise HandleWebException(ErrorResponse(error_message="Неверный логин или пароль", status_code=HTTPStatus.BAD_REQUEST))

    async def register_user(self, register_data: RegisterData) -> None:
        validator = Validator(register_data)
        validator.length("password", min_len=6, max_len=200)
        validator.length("full_name", min_len=4, max_len=250)
        validator.length("username", min_len=4, max_len=100)
        validator.check()
        if UserDAO.find_by_username(register_data.username):
            raise HandleWebException(ErrorResponse(error_message="username занят", status_code=HTTPStatus.BAD_REQUEST, detail=[{"username": "Этот username занят"}]))
        cached_password = hash_any(register_data.password)
        UserDAO.add(**{**register_data.to_dict(), "password": cached_password})

