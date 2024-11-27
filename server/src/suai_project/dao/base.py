from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import update as sqlalchemy_update, delete as sqlalchemy_delete
from suai_project.services.database import Session


class BaseDAO:
    model = None

    @classmethod
    def find_all(cls, **filter_by):
        with Session() as session:
            query = select(cls.model).filter_by(**filter_by)
            return list(session.scalars(query))

    @classmethod
    def find_one_or_none_by_id(cls, data_id):
        with Session() as session:
            query = select(cls.model).filter_by(id=data_id)
            return session.execute(query).scalar_one_or_none()

    @classmethod
    def add(cls, **values):
        with Session() as session:
            with session.begin():
                new_instance = cls.model(**values)
                session.add(new_instance)
                try:
                    session.commit()
                except SQLAlchemyError as e:
                    session.rollback()
                    raise e
                return new_instance

    @classmethod
    def update(cls, filter_by, **values):
        with Session() as session:
            with session.begin():
                query = (
                    sqlalchemy_update(cls.model)
                    .where(*[getattr(cls.model, k) == v for k, v in filter_by.items()])
                    .values(**values)
                    .execution_options(synchronize_session="fetch")
                )
                result = session.execute(query)
                try:
                    session.commit()
                except SQLAlchemyError as e:
                    session.rollback()
                    raise e
                return result.rowcount

    @classmethod
    def delete(cls, delete_all: bool = False, **filter_by):
        if not delete_all and not filter_by:
            raise ValueError("Необходимо указать хотя бы один параметр для удаления.")

        with Session() as session:
            with session.begin():
                query = sqlalchemy_delete(cls.model).filter_by(**filter_by)
                result = session.execute(query)
                try:
                    session.commit()
                except SQLAlchemyError as e:
                    session.rollback()
                    raise e
                return result.rowcount