import os
import google.generativeai as genai
from mcp import tool  # decorator
from typing import Any

# Initialize Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")  # adjust model name if needed

@tool()  # decorator registers this as a tool
async def gemini_chat(prompt: str) -> str:
    """
    Send a prompt to Gemini LLM and return the response text.
    """
    result = model.generate_content(prompt)
    return result.text
