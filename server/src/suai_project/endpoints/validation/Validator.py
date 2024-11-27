import re
from http import HTTPStatus
from typing import Any, List, Callable

from suai_project.services.error_service import HandleWebException, ErrorResponse

email_pattern = r"""^(?:[a-z0-9!#${'$'}%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#${'$'}%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$"""

class Validator:

    def __init__(self, data: Any):
        self.data = data.to_dict()
        self.errors: List[dict[str, str]] = []

    def check(self):
        if self.errors:
            keys= next(iter(self.errors[0].keys().mapping))
            raise HandleWebException(ErrorResponse(error_message=self.errors[0][keys], status_code=HTTPStatus.BAD_REQUEST, detail=self.errors))

    def length(self, field: str, min_len: int = None, max_len: int = None, optional: bool = False):
        value = self.get_value(field)
        if not value:
            if not optional:
                self.errors.append({field: 'Поле обязательное'})
            return
        if min_len and len(value) < min_len:
            self.errors.append({field: f'Минимальная длина {min_len}'})
        elif max_len and len(value) > max_len:
            self.errors.append({field: f'Максимальная длина {max_len}'})

    def range(self, field: str, min: int = None, max: int = None, optional: bool = False):
        value = self.get_value(field)
        if not value:
            if not optional:
                self.errors.append({field: 'Поле обязательное'})
            return
        if min and  int(value) < min:
            self.errors.append({field: f'Минимум {min}'})
        elif max and value > max:
            self.errors.append({field: f'Максимум {max}'})

    def email(self, field: str, optional: bool = False):
        value = self.get_value(field)
        if not optional:
            if value:
                self.errors.append({field: 'Поле обязательное'})
                return
        if re.compile(email_pattern).match(value):
            self.errors.append({field: 'Не валидный email'})

    def get_value(self, field: str) -> Any:
        keys = field.split('.')
        value = self.data
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key)
            elif isinstance(value, list):
                try:
                    index = int(key)
                    value = value[index]
                except (ValueError, IndexError):
                    return None
            else:
                return None
        return value