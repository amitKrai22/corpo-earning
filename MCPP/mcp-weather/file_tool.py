from mcp.server.fastmcp import FastMCP, Context
from pathlib import Path
mcp = FastMCP("file")
NOTES_DIR = Path("notes")
NOTES_DIR.mkdir(exist_ok=True)

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