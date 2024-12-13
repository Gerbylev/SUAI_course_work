from hashlib import sha256
from http import HTTPStatus
from typing import List, Optional, Union, Tuple

from pydantic import StrictStr, StrictInt, StrictBytes

from suai_project.dao.comment_dao import CommentDao
from suai_project.dao.solution_details_dao import SolutionDetailsDAO
from suai_project.dao.solved_dao import SolvedDAO
from suai_project.dao.task_dao import TaskDAO
from suai_project.dao.user_dao import UserDAO
from suai_project.endpoints.apis.solution_api_base import BaseSolutionApi
from suai_project.endpoints.models.comment_data import CommentData
from suai_project.endpoints.models.extra_models import TokenModel
from suai_project.endpoints.models.solution_data import SolutionData
from suai_project.endpoints.models.solutions_data import SolutionsData
from suai_project.services.account_service import get_account_with_raise
from suai_project.services.error_service import HandleWebException, ErrorResponse
from suai_project.utils.generate_token import generate_key


class SolutionEndpoint(BaseSolutionApi):

    async def get_solution(self, taskId: StrictStr,
                           token_BearerAuth: TokenModel) -> SolutionData:
        user = get_account_with_raise(token_BearerAuth)
        unique_id = sha256(f"{user.id}{taskId}".encode()).hexdigest()
        try:
            solution = SolvedDAO.find_one_or_none_by_id(unique_id)
            if not solution and solution.user_id != user.id:
                raise HandleWebException(
                    ErrorResponse(error_message="Solution not found or access denied", status_code=HTTPStatus.BAD_REQUEST))
            solution_id = solution.id
            comments = SolutionDetailsDAO.find_all(**{"solved_id": solution_id})
            comments = [CommentData(status=comment.status, message=comment.comment) for comment in comments]
            solution = SolutionData(status=solution.status, comments=comments)
            return solution
        except:
            raise HandleWebException(
                ErrorResponse(error_message="Solution not found or access denied", status_code=HTTPStatus.BAD_REQUEST))


    async def get_solutions(self, taskId: StrictStr, token_BearerAuth: TokenModel) -> List[SolutionsData]:
        user = get_account_with_raise(token_BearerAuth)
        task = TaskDAO.find_one_or_none_by_id(taskId)
        if task and task.user_id == user.id:
            result =[]
            solutions = SolvedDAO.find_all(**{"task_id": taskId})
            solutions = sorted(solutions, key=lambda solution: solution.created_at)
            for solution in solutions:
                account =  UserDAO.find_one_or_none_by_id(solution.user_id)
                result.append(SolutionsData(id=solution.id, author=account.full_name, status=solution.status))
            return result
        else:
            raise HandleWebException(
                ErrorResponse(error_message="Chat not found or access denied", status_code=HTTPStatus.BAD_REQUEST))