from typing import List

from pydantic.dataclasses import dataclass

from suai_project.endpoints.dto.task_dto import FileDto


@dataclass
class WorkDto:
    contents: List[FileDto]