import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from routers.brands import router as brands_router
from routers.forecast import router as forecast_router
from routers.ibp import router as ibp_router
from routers.financial import router as financial_router
from routers.overrides import router as overrides_router

app = FastAPI()

# API routes
app.include_router(brands_router,prefix="/api")
app.include_router(forecast_router, prefix="/api")

app.include_router(ibp_router,prefix="/api")
app.include_router(financial_router,prefix="/api")
app.include_router(overrides_router,prefix="/api")

# Existing health endpoint

@app.get("/api/health")
def health():
    return {"status": "ok"}

# Existing React static serving

STATIC = Path(__file__).parent / "static"

if (STATIC / "assets").is_dir():
    app.mount(
        "/assets",
        StaticFiles(directory=STATIC / "assets"),
        name="assets"
    )

@app.get("/{full_path:path}")
def spa(full_path: str):

    file = STATIC / full_path

    if full_path and file.is_file():
        return FileResponse(file)

    return FileResponse(STATIC / "index.html")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(
            os.getenv(
                "DATABRICKS_APP_PORT",
                8000
            )
        )
    )