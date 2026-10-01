import os
import psycopg
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

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
    return _ws.config.oauth_token().access_token   # SDK caches + refreshes this


class TokenConnection(psycopg.Connection):
    """Gets a fresh token each time the pool opens a NEW physical connection."""
    @classmethod
    def connect(cls, conninfo="", **kwargs):
        kwargs["password"] = _password()
        return super().connect(conninfo, **kwargs)


pool = ConnectionPool(
    conninfo=psycopg.conninfo.make_conninfo(
        host=os.environ["PGHOST"],
        port=os.getenv("PGPORT", "5432"),
        dbname=os.environ["PGDATABASE"],
        user=os.environ["PGUSER"],
        sslmode=os.getenv("PGSSLMODE", "require"),
    ),
    connection_class=TokenConnection,
    kwargs={"row_factory": dict_row},       # rows come back as dicts -> JSON
    min_size=1,
    max_size=5,
    max_lifetime=45 * 60,                   # recycle before the OAuth token (~1h) expires
    check=ConnectionPool.check_connection,  # skip dead/idle-dropped connections
    open=False,                             # opened in app.py lifespan
)


def get_connection():
    """FastAPI dependency: borrow a pooled connection, commit or rollback, give it back."""
    with pool.connection() as conn:
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
    # no conn.close() -> the connection goes back to the pool