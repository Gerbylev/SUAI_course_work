import logging

from openai import AsyncOpenAI

from suai_project.config.Config import CONFIG

class LLMService:

    def __init__(self):
        self.openai = AsyncOpenAI(
            api_key=CONFIG.gpt.token,
            base_url=CONFIG.gpt.url
        )
        self.total_input_token = 0
        self.total_output_token = 0

    async def fetch_completion_with_messages(self, args) -> str:
        counter = 0
        if 'messages' not in args:
            raise "Не передан messages"
        while True:
            try:
                res = await self.__fetch_completion_with_messages(args)
                logging.info(f"ответ к gpt: {res}")
                return res
            except Exception as e:
                counter += 1
                if counter < 3:
                    logging.warning(f"ошибка при запросе к caila: {str(e)}")
                else:
                    raise e

    async def fetch_completion(self, prompt: str, args=None) -> str:
        logging.info(f"запрос к gpt: {prompt}")
        counter = 0
        while True:
            try:
                res = await self.__fetch_completion(prompt, (args or {}))
                logging.info(f"ответ к gpt: {res}")
                return res
            except Exception as e:
                counter += 1
                if counter < 3:
                    logging.warning(f"ошибка при запросе к caila: {str(e)}")
                else:
                    raise e

    async def __fetch_completion(self, prompt: str, args) -> str:
        res = await self.openai.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=CONFIG.gpt.model,
            temperature=0,
            stream=False,
            **args
        )

        if res.usage:
            self.total_input_token += int(res.usage.prompt_tokens)
            self.total_output_token += int(res.usage.completion_tokens)
        else:
            logging.warning("No usage info")

        return str(res.choices[0].message.content)

    async def __fetch_completion_with_messages(self, args) -> str:
        res = await self.openai.chat.completions.create(
            model=CONFIG.gpt.model,
            temperature=0,
            stream=False,
            **args
        )

        if res.usage:
            self.total_input_token += int(res.usage.prompt_tokens)
            self.total_output_token += int(res.usage.completion_tokens)
        else:
            logging.warning("No usage info")

        return str(res.choices[0].message.content)