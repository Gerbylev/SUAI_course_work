from suai_project.endpoints.apis.account_api_base import BaseAccountApi
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.token_data import TokenData


class AccountEndpoint(BaseAccountApi):
    async def account_info(self, token_BearerAuth: TokenModel) -> TokenData:

        return await super().account_info(token_BearerAuth)