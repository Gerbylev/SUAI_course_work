FROM python:3.11

COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /app

COPY src .

EXPOSE 5000

ENV PROFILE 'prod'

RUN rm -f /app/config-local.yml

ENTRYPOINT ["sh", "-c", "alembic upgrade head && python main.py"]
