from typing import Optional, List

from pydantic.dataclasses import dataclass

@dataclass
class FileDto:
    file_name: str
    content: str

@dataclass
class HighlightDto:
    task: str
    requirement: List[str]

@dataclass
class TaskDto:
    task: str  # MarkDown or text
    example: Optional[List[FileDto]]
    highlights: List[HighlightDto]