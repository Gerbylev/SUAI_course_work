import uvicorn
import fastapi
from starlette.responses import JSONResponse

from suai_project.config.Config import CONFIG
from suai_project.endpoints import router_init
# import prometheus_client

from suai_project.services.error_service import custom_exception_handler, generic_exception_handler, HandleWebException
from suai_project.utils.logger import get_logger_univorn

app = router_init.app

app.add_exception_handler(HandleWebException, custom_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

with open(CONFIG.api_schema_path) as f:
    api_spec_content = f.read()

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    if isinstance(exc, ValueError):
        return JSONResponse(
            status_code=400,
            content={"error": str(exc)},
        )

    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred."},
    )

@app.get("/api/spec.yml")
async def spec_yml():
    return fastapi.Response(api_spec_content, media_type="plain/text")

# def start_prometheus_client():
#     prometheus_client.start_http_server(CONFIG.prometheus_port)

def start_web_server():
    config = uvicorn.Config("main:app", host="0.0.0.0", port=CONFIG.server_port)  # , log_config=get_logger_univorn()
    server = uvicorn.Server(config)
    server.run()

if __name__ == "__main__":
    print("Starting web server ...")
    # start_prometheus_client()
    start_web_server()
