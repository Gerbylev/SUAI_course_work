# import asyncio
# import os
# import pickle
# from typing import List
#
# from certifi import contents
#
# from suai_project.endpoints.dto.task_dto import TaskDto, FileDto
# from suai_project.endpoints.dto.work_dto import WorkDto
# from suai_project.services.LLMService import LLMService
# from suai_project.services.TaskService import TaskService
# from suai_project.services.WorkService import WorkService
# from suai_project.services.registry import REGISTRY
#
# task_text = '''
# Лабораторная работа № 3. Структуры данных:
# очередь, дерево, куча
# Цель работы: научиться реализовывать такие базовые
# структуры данных, как: очередь, дерево и куча.
# Требования к формату защиты лабораторной работы:
# • Отчет (титульный лист, текст задания с кодом решения,
# выводы);
# • Готовность внести исправления в присутствии
# преподавателя и ответить на вопросы.
# • Каждое задание должно содержать минимум 5 тестов
# (для защиты на максимум баллов тестами должны быть
# покрыты все методы), 2 бенчмарка и быть реализовано
# с использованием Type Hinting.
# Выберете вариант, соответствующий вашему порядковому
# номеру в журнале группы. В том случае, если ваш порядковый
# номер больше последнего номера варианта, используйте
# следующую формулу: N = n % f + 1, где n – ваш порядковый
# номер, f – номер последнего варианта, N – вариант для
# выполнения.
#
# 7. Реализуйте структуру данных «АВЛ-дерево», элементами
# которой выступают экземпляры класса Student (минимум
# 10 элементов), содержащие следующие поля (ФИО, номер
# группы, курс, возраст, средняя оценка за время обучения),
# где в качестве ключевого элемента при добавлении будет
# выступать средняя оценка. Структура данных должна иметь
# возможность сохранять свое состояние в файл и загружать
# данные из него. Также реализуйте 2 варианта проверки
# вхождения элемента в структуру данных.
#
# 11. Реализуйте структуру данных «Максимальная куча» на
# основе двусвязного списка, элементами которой выступают
# экземпляры класса Student (минимум 10 элементов),
# содержащие следующие поля (ФИО, номер группы, курс,
# возраст, средняя оценка за время обучения), где в качестве
# ключевого элемента при добавлении будет выступать
# средняя оценка. Структура данных должна иметь
# возможность сохранять свое состояние в файл и загружать
# данные из него. Также реализуйте 2 варианта проверки
# вхождения элемента в структуру данных.
# '''
#
#
# def get_file_dto_from_folder(folder_path: str) -> List[FileDto]:
#     file_dtos = []
#     ignore_dirs = {'.venv', '.idea', '__pycache__'}  # Список игнорируемых директорий
#
#     # Проверяем, что переданный путь - это папка
#     if not os.path.isdir(folder_path):
#         raise ValueError(f"The path '{folder_path}' is not a valid directory.")
#
#     # Проходим по всем файлам в папке
#     for root, dirs, files in os.walk(folder_path):
#         # Удаляем игнорируемые директории из списка обхода
#         dirs[:] = [d for d in dirs if d not in ignore_dirs]
#
#         for file in files:
#             file_path = os.path.join(root, file)
#             try:
#                 # Читаем содержимое файла
#                 with open(file_path, 'r', encoding='utf-8') as f:
#                     content = f.read()
#                 # Сохраняем относительный путь как file_name
#                 relative_path = os.path.relpath(file_path, folder_path)
#                 file_dtos.append(FileDto(file_name=relative_path, content=content))
#             except Exception as e:
#                 print(f"Error reading {file_path}: {e}")
#
#     return file_dtos
#
#
# async def main():
#     llm_service = LLMService()
#     REGISTRY.put(llm_service)
#     work_service = WorkService()
#     task_service = TaskService()
#     task_dto = await task_service.indexing_task(task_text)
#     with open('task_dto.pkl', 'wb') as f:
#         pickle.dump(task_dto, f)
#     # with open('task_dto.pkl', 'rb') as f:
#     #     task_dto = pickle.load(f)
#     work_dto = WorkDto(contents=get_file_dto_from_folder('/home/oleg/forTest/lab3/'))
#     await work_service.check_work(work_dto, task_dto)
#
# if __name__ == "__main__":
#     asyncio.run(main())