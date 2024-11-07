import asyncio
import os
import random
from cgitb import reset
from importlib.metadata import files
from tabnanny import check
from typing import List

import yaml
from jinja2 import Template

from suai_project.endpoints.dto.task_dto import TaskDto, FileDto, HighlightDto
from suai_project.endpoints.dto.work_dto import WorkDto
from suai_project.services.AgencyService import AgencyService
from suai_project.services.LLMService import LLMService
from suai_project.services.registry import REGISTRY

prompt_file_path = os.path.join(os.path.dirname(__file__), 'prompts.yml')
with open(prompt_file_path, 'r', encoding='utf-8') as file:
    data = yaml.safe_load(file)

prompt_for_check_code_style = Template(data['check_code_style'])
prompt_for_chose_file_for_check_code_style = Template(data['chose_file_for_check_code_style'])

class WorkService:

    def __init__(self):
        self.llm_service: LLMService = REGISTRY.get(LLMService)

    async def check_work(self, work: WorkDto, task: TaskDto)-> dict[str, str]:
        style_recommendation = await self.__check_code_style(work.contents)
        tasks = []

        for highlight in task.highlights:
            tasks.append(self.__check_subtask(work.contents, highlight))

        results = await asyncio.gather(*tasks)

        for result in results:
            print(result)

        return results

    async def __check_code_style(self, files: List[FileDto])-> dict[str, str]:
        def parse_code_style(text: str):
            lines = text.splitlines()
            if 'great' in lines[0]:
                return {"grade": "great", "comment": ""}
            elif 'good' in lines[0]:
                return {"grade": "good", "comment": "\n".join(lines[1::])}
            elif 'terribly' in lines[0]:
                return {"grade": "terribly", "comment": "\n".join(lines[1::])}
            else:
                return {"grade": "error", "comment": text}


        if len(files) > 10:
            prompt = prompt_for_chose_file_for_check_code_style.render(files=files)
            result = await self.llm_service.fetch_completion(prompt, {"max_tokens": 300})
            lines = result.splitlines()
            files = [file for file in files if file.file_name in lines]
        prompt = prompt_for_check_code_style.render(files=files)
        result = await self.llm_service.fetch_completion(prompt, {"max_tokens": 500})
        return parse_code_style(result)

    async def __check_subtask(self, files: List[FileDto], highlight: HighlightDto)-> dict[str, str]:
        agent = AgencyService(files, highlight)
        result = await agent.check_task()
        return result

    async def __verdict(self, task_text: str, comments: List[str]) -> dict[str, str]:
        pass