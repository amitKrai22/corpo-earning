# inspect_mcp.py
import mcp
import mcp.server

print(dir(mcp))
print(dir(mcp.server))
print(dir(mcp.server.fastmcp) if hasattr(mcp.server, "fastmcp") else None)
