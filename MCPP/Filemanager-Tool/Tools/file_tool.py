import os
from mcp import tool
from typing import Any

BASE_DIR = "workspace"
os.makedirs(BASE_DIR, exist_ok=True)

@tool()
async def file_manager(action: str, filename: str, content: str | None = None) -> str:
    """
    Read or write files in the workspace directory.
    action: 'read' or 'write'
    filename: name of file relative to workspace
    content: text content to write (if action == 'write')
    """
    filepath = os.path.join(BASE_DIR, filename)

    if action == "read":
        if not os.path.exists(filepath):
            return f"File {filename} not found."
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()

    elif action == "write":
        # if content is None, write empty string
        text = content or ""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(text)
        return f"✅ Wrote {len(text)} chars to {filename}"

    else:
        return "❌ Invalid action. Use 'read' or 'write'."
