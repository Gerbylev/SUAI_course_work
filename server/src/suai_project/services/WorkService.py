import asyncio
import os
import random
from cgitb import reset
from importlib.metadata import files
from pathlib import Path
from tabnanny import check
from typing import List

import yaml
from jinja2 import Template

from suai_project.dao.solution_details_dao import SolutionDetailsDAO
from suai_project.dao.solved_dao import SolvedDAO
from suai_project.dao.subtask_dao import SubtaskDao
from suai_project.dao.task_dao import TaskDAO
from suai_project.endpoints.dto.task_dto import TaskDto, FileDto, HighlightDto
from suai_project.endpoints.dto.work_dto import WorkDto
from suai_project.models.models import Task, Subtask
from suai_project.services.AgencyService import AgencyService
from suai_project.services.LLMService import LLMService
from suai_project.services.registry import REGISTRY

prompt_file_path = os.path.join(os.path.dirname(__file__), 'prompts.yml')
with open(prompt_file_path, 'r', encoding='utf-8') as file:
    data = yaml.safe_load(file)

prompt_for_check_code_style = Template(data['check_code_style'])
prompt_for_chose_file_for_check_code_style = Template(data['chose_file_for_check_code_style'])

BASE_DIR = Path("uploaded_files")

def get_file_dto_from_folder(folder_path: str) -> List[FileDto]:
    file_dtos = []
    ignore_dirs = {'.venv', '.idea', '__pycache__'}

    if not os.path.isdir(folder_path):
        raise ValueError(f"The path '{folder_path}' is not a valid directory.")

    for root, dirs, files in os.walk(folder_path):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]

        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                relative_path = os.path.relpath(file_path, folder_path)
                file_dtos.append(FileDto(file_name=relative_path, content=content))
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

    return file_dtos

class WorkService:

    def __init__(self):
        self.llm_service: LLMService = REGISTRY.get(LLMService)

    async def check_work(self, work_dir: str, task_id: str, solved_id: str)-> dict[str, str]:
        work = get_file_dto_from_folder(work_dir)
        # style_recommendation = await self.__check_code_style(work)
        tasks = []
        task = TaskDAO.find_one_or_none_by_id(task_id)
        subtasks = SubtaskDao.find_all(**{"task_id": task_id})
        for highlight in subtasks:
            tasks.append(self.__check_subtask(work, highlight, task))

        results = await asyncio.gather(*tasks)

        all_good = True
        for result in results:
            SolutionDetailsDAO.add(**{"status": result['status'], "comment": result['description'], 'solved_id': solved_id})
            if result['status'] != 'ok':
                all_good = False
        SolvedDAO.update(filter_by={"id": solved_id}, **{"status": "решено" if all_good else "не решено"})

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

    async def __check_subtask(self, files: List[FileDto], highlight: Subtask, task: Task)-> dict[str, str]:
        agent = AgencyService(files, highlight, task.task)
        result = await agent.check_task()
        return result

    async def __verdict(self, task_text: str, comments: List[str]) -> dict[str, str]:
        pass