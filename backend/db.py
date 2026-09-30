import os
import psycopg
from psycopg.rows import dict_row

# Local only: load ../.env (not present on Databricks, so it's skipped there)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass

_ws = None

def _password() -> str:
    if os.getenv("PGPASSWORD"):
        return os.environ["PGPASSWORD"]
    global _ws
    from databricks.sdk import WorkspaceClient
    if _ws is None:
        _ws = WorkspaceClient()
    return _ws.config.oauth_token().access_token


def get_connection():
    """FastAPI dependency: one connection per request, commit or rollback."""
    conn = psycopg.connect(
        host=os.environ["PGHOST"],
        port=os.getenv("PGPORT", "5432"),
        dbname=os.environ["PGDATABASE"],
        user=os.environ["PGUSER"],
        password=_password(),
        sslmode=os.getenv("PGSSLMODE", "require"),
        row_factory=dict_row,   # rows come back as dicts -> JSON
    )
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()