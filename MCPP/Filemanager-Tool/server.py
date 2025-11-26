# server.py
import os
import google.generativeai as genai
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
import asyncio

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")
mcp = FastMCP("llm_filemanager")

BASE_DIR = "workspace"
os.makedirs(BASE_DIR, exist_ok=True)

@mcp.tool()
async def gemini_chat(prompt: str) -> str:
    result = model.generate_content(prompt)
    return result.text

@mcp.tool()
async def file_manager(action: str, filename: str, content: str | None = None) -> str:
    filepath = os.path.join(BASE_DIR, filename)
    if action == "read":
        if not os.path.exists(filepath):
            return f"❌ File {filename} not found."
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    elif action == "write":
        text = content or ""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(text)
        return f"✅ Wrote {len(text)} chars to {filename}"
    else:
        return "❌ Invalid action. Use 'read' or 'write'."

if __name__ == "__main__":
    asyncio.run(mcp.run())   # 👈 keep server alive
