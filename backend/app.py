import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()
STATIC = Path(__file__).parent / "static"

@app.get("/api/health")
def health():
    return {"status": "ok"}

if (STATIC / "assets").is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC / "assets"), name="assets")

@app.get("/{full_path:path}")
def spa(full_path: str):
    file = STATIC / full_path
    if full_path and file.is_file():
        return FileResponse(file)
    return FileResponse(STATIC / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("DATABRICKS_APP_PORT", 8000)))