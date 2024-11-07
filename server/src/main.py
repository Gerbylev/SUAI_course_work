import uvicorn
import fastapi

from suai_project.config.Config import CONFIG
from suai_project.endpoints import router_init
import prometheus_client

from suai_project.utils.logger import get_logger_univorn

app = router_init.app

with open(CONFIG.api_schema_path) as f:
    api_spec_content = f.read()

@app.get("/api/spec.yml")
async def spec_yml():
    return fastapi.Response(api_spec_content, media_type="plain/text")

def start_prometheus_client():
    prometheus_client.start_http_server(CONFIG.prometheus_port)

def start_web_server():
    config = uvicorn.Config("main:app", host="0.0.0.0", port=CONFIG.server_port)  # , log_config=get_logger_univorn()
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    print("Starting web server ...")
    start_prometheus_client()
    start_web_server()
