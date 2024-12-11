from suai_project.dao.solved_dao import SolvedDAO
from suai_project.endpoints.apis.account_api_base import BaseAccountApi
from suai_project.endpoints.models.account_data import AccountData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.token_data import TokenData
from suai_project.services.account_service import get_account_with_raise


class AccountEndpoint(BaseAccountApi):
    async def account_info(self, token_BearerAuth: TokenModel) -> AccountData:
        user = get_account_with_raise(token_BearerAuth)
        tasks = SolvedDAO.find_all(**{'user_id': user.id})
        return AccountData(username=user.username, full_name=user.full_name, solved_tasks=len(tasks))
