from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
import os
import httpx
import datetime
import json

load_dotenv()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
mcp = FastMCP("weather")

@mcp.tool(
    description="Get current temperature for a city. Input should be a JSON string like '{\"city\": \"London\", \"unit\": \"celsius\"}'."
)
async def get_weather(input_str: str) -> dict:
    """
    Get current temperature for a city using OpenWeatherMap.
    The input should be a JSON string like '{"city": "London", "unit": "celsius"}'
    """
    if not OPENWEATHER_API_KEY:
        raise RuntimeError("OPENWEATHER_API_KEY missing")

    try:
        input_data = json.loads(input_str)
        city = input_data.get("city")
        unit = input_data.get("unit", "celsius")
    except json.JSONDecodeError:
        raise ValueError("Invalid input format. Expected a JSON string.")

    if not city:
        raise ValueError("City not provided in the input.")

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

if __name__ == "__main__":
    mcp.run(transport="streamable-http")