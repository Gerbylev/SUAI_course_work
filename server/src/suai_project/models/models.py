from datetime import datetime

from sqlalchemy import Column, Integer, String, create_engine, MetaData, ForeignKey, Text, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy.testing.schema import mapped_column

from suai_project.services.database import Base, int_pk, str_pk


class User(Base):
    id: Mapped[int_pk]
    username: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(256), nullable=False, unique=False)
    full_name: Mapped[str] = mapped_column(String(250), nullable=False, unique=False)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', full_name='{self.full_name}')>"

class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    token: Mapped[str] = mapped_column(String(40), nullable=False, unique=True)

class Task(Base):
    id: Mapped[str_pk]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(526), nullable=False)
    task: Mapped[str] = mapped_column(Text, nullable=False)
    example: Mapped[str] = mapped_column(String(256), nullable=True, unique=True)
    is_analyzed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

