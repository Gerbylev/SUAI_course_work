import os
import re
from typing import List

import yaml
from jinja2 import Template

from suai_project.dao.subtask_dao import SubtaskDao
from suai_project.dao.task_dao import TaskDAO
from suai_project.endpoints.dto.task_dto import FileDto, HighlightDto, TaskDto
from suai_project.models.models import Task
from suai_project.services.LLMService import LLMService
from suai_project.services.registry import REGISTRY

prompt_file_path = os.path.join(os.path.dirname(__file__), 'prompts.yml')
with open(prompt_file_path, 'r', encoding='utf-8') as file:
    data = yaml.safe_load(file)

highlights_from_text = Template(data['highlights_from_text'])
highlights_from_text_and_files = Template(data['highlights_from_text_and_files'])

class TaskService:

    def __init__(self):
        self.llm_service: LLMService = REGISTRY.get(LLMService)

    async def indexing_task(self, task: Task, example: FileDto = None, comment: str = None)-> TaskDto:
        # if not example:
        highlights = await self.__get_highlights_from_text(task)
        # else:
        #     highlights = await self.__get_highlights_from_text_and_file(task, example)
        for highlight in highlights:
            SubtaskDao.add(**{"task_id": task.id, "text": highlight})
        TaskDAO.update(filter_by={"id": task.id}, **{"is_analyzed": True})


    async def __get_highlights_from_text(self, task_text: str, comment: str = None) -> List[str]:
        def parse_task_description(text:str):
            result = []
            lines = text.splitlines()
            for line in lines:
                if '-' in line:
                    parts = line.split('-')
                    if len(parts) > 1:
                        requirement = parts[1].strip()
                        result.append(requirement)


            return result

        prompt = highlights_from_text.render(task_text=task_text, comment=comment)
        response = await self.llm_service.fetch_completion(prompt)
        return parse_task_description(response)


    async def __get_highlights_from_text_and_file(self, task_text: str, example: FileDto)-> HighlightDto:
        prompt = highlights_from_text_and_files.render(task_text, example)
        pass

