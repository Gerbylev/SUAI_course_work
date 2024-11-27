import os
from typing import List

import yaml
from jinja2 import Template

from suai_project.endpoints.dto.task_dto import HighlightDto, FileDto
from suai_project.endpoints.dto.work_dto import WorkDto
from suai_project.services.LLMService import LLMService
from suai_project.services.registry import REGISTRY

prompt_file_path = os.path.join(os.path.dirname(__file__), 'prompts.yml')
with open(prompt_file_path, 'r', encoding='utf-8') as file:
    data = yaml.safe_load(file)

prompt_files = Template(data['prompt_files'])
agency_prompt = Template(data['agency_prompt'])
prompt_back_to_script = Template(data['prompt_back_to_script'])
put_files = Template(data['put_files'])



class AgencyService:

    def __init__(self, files: List[FileDto], highlight: HighlightDto, max_iter = 10):
        self.llm_service: LLMService = REGISTRY.get(LLMService)
        self.count = 0
        self.max_iter = max_iter
        self.files = files
        self.highlight = highlight
        self.messages = [
            {"role": "user", "content": [{
                                         "type": "text",
                                         "text": prompt_files.render(files=self.files),
                                         "cache_control": {"type": "ephemeral"}
                                         },
                                         {
                                         "type": "text",
                                         "text": agency_prompt.render(highlight=self.highlight),
                                         }]
            }
        ]

    async def check_response(self, response: str):
        lines = response.splitlines()
        if "запрашиваю файлы" in lines[0].lower():
            files = [file for file in self.files if file.file_name in lines[1::]]
            self.messages.append({"role": "user", "content": put_files.render(files=files)})
        elif "ответ" in lines[0].lower():
            status = 'fail'
            if 'выполнено' in lines[0].lower():
                status = 'ok'
            return {"status": status, "description": '\n'.join(lines[1::]), "highlight": self.highlight, "iter": self.count }
        else:
            self.messages.append({"role": "user", "content": prompt_back_to_script.render()})
        return await self.agency_step()

    async def agency_step(self):
        if self.count <= self.max_iter:
            response = await self.llm_service.fetch_completion_with_messages({'messages': self.messages, "max_tokens": 200})
            self.messages.append({"role": 'assistant', 'content': response})
            self.count += 1
            return await self.check_response(response)
        else:
            return {"status": "fail", "description": "закончились итерации", "highlight": self.highlight, "iter": self.count }



    async def check_task(self):
        return await self.agency_step()




