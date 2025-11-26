# client.py
import asyncio
from mcp import ClientSession
from mcp import StdioServerParameters
from mcp.client.stdio import stdio_client
import os
from dotenv import load_dotenv

async def main():
    load_dotenv()
    # Define how to run the server via stdio
    server_params = StdioServerParameters(command="python", args=["server.py"])

    # Create the stdio transport client
    client_transport = await stdio_client(server_params).__aenter__()

    # This gives you (reader, writer)
    (reader, writer) = client_transport

    # Create a session on top of transport
    session = await ClientSession(reader, writer).__aenter__()

    # Initialize handshake
    await session.initialize()

    # List tools
    tools_resp = await session.list_tools()
    print("🔧 Tools:", [tool.name for tool in tools_resp.tools])

    # Call gemini_chat
    result = await session.call_tool("gemini_chat", {"prompt": "Hello from client!"})
    print("Gemini says:", result.content[0].text)

    # Write a file
    await session.call_tool("file_manager", {
        "action": "write",
        "filename": "hello.txt",
        "content": "Hello file via MCP client."
    })

    # Read it back
    result = await session.call_tool("file_manager", {
        "action": "read",
        "filename": "hello.txt"
    })
    print("File content:", result.content[0].text)

    # Close session & transport properly
    await session.__aexit__(None, None, None)
    await client_transport.__aexit__(None, None, None)

if __name__ == "__main__":
    asyncio.run(main())
