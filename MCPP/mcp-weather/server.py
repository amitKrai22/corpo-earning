# server.py
import os
import datetime
from pathlib import Path
from types import SimpleNamespace
from contextlib import asynccontextmanager
import httpx
import asyncpg
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP, Context

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
NOTES_DIR = Path("notes")
NOTES_DIR.mkdir(exist_ok=True)

@asynccontextmanager
async def lifespan():
    # init DB pool and ensure table exists
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    async with pool.acquire() as conn:
        await conn.execute("""
        CREATE TABLE IF NOT EXISTS weather_reports (
            id serial PRIMARY KEY,
            city text NOT NULL,
            temperature double precision NOT NULL,
            fetched_at timestamptz NOT NULL
        );
        """)
    yield SimpleNamespace(db=pool, notes_dir=NOTES_DIR)
    await pool.close()

mcp = FastMCP("weather-server")

# ---- Weather tool ----
@mcp.tool()
async def get_weather(city: str, unit: str = "celsius") -> dict:
    """Get current temperature for a city using OpenWeatherMap."""
    if not OPENWEATHER_API_KEY:
        raise RuntimeError("OPENWEATHER_API_KEY missing")
    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric" if unit.lower().startswith("c") else "imperial",
    }
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.openweathermap.org/data/2.5/weather", params=params, timeout=10.0)
        r.raise_for_status()
        data = r.json()
    temp = float(data["main"]["temp"])
    fetched_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return {"city": city, "temperature": temp, "unit": unit, "fetched_at": fetched_at}

# ---- DB tool ----
@mcp.tool()
async def save_weather(city: str, temperature: float, fetched_at: str, ctx: Context) -> dict:
    """Save weather report into Postgres (returns status)."""
    pool = ctx.request_context.lifespan_context.db
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO weather_reports (city, temperature, fetched_at) VALUES ($1, $2, $3)",
            city, temperature, fetched_at
        )
    return {"status": "saved"}

# ---- File tools (safe) ----
def _safe_path(base: Path, name: str) -> Path:
    candidate = (base / name).resolve()
    base_resolved = base.resolve()
    if not str(candidate).startswith(str(base_resolved)):
        raise ValueError("Invalid filename (possible path traversal)")
    return candidate

@mcp.tool()
def write_note(filename: str, content: str, ctx: Context | None = None) -> str:
    """Write a note in the server's notes/ directory (safe)."""
    base = ctx.request_context.lifespan_context.notes_dir if ctx else NOTES_DIR
    path = _safe_path(base, filename)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return f"wrote:{str(path)}"

@mcp.tool()
def read_note(filename: str, ctx: Context | None = None) -> str:
    """Read a note from notes/ directory."""
    base = ctx.request_context.lifespan_context.notes_dir if ctx else NOTES_DIR
    path = _safe_path(base, filename)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()
app = mcp.streamable_http_app()
if __name__ == "__main__":
    # preferred: streamable http (modern)
    # this exposes an ASGI app you can run via `uvicorn server:app --reload`
    try:
        import uvicorn
        uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
    except Exception:
        # fallback: run built-in runner (old / simple)
        mcp.run(transport="sse")
