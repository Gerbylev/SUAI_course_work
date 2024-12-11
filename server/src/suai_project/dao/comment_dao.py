from suai_project.dao.base import BaseDAO
from suai_project.models.models import Comment


class CommentDao(BaseDAO):
    model = Comment