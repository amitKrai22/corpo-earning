from mcp import ClientSession
from mcp.client.sse import sse_client
import asyncio
async def main():
    async with sse_client("http://localhost:8000/sse") as streams:
        async with ClientSession(*streams) as session:
            await session.initialize()

            # List of available tools
            tools = await session.list_tools()
            print(tools)

            # Call the add tool
            result_add = await session.call_tool("add", {"a": 5, "b": 3})
            result_subtract = await session.call_tool("subtract", {"a": 5, "b": 3})
            result_multiply = await session.call_tool("multiply", {"a": 5, "b": 3})
            print(result_add.content[0].text)
            print(result_subtract.content[0].text)
            print(result_multiply.content[0].text)


if __name__ == "__main__":
    asyncio.run(main())