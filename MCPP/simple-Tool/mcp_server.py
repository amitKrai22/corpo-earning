from mcp.server.fastmcp import FastMCP

mcp = FastMCP()

# calculator tool
@mcp.tool()
def add(a:int, b:int)-> int:
    """ ADD TWO NUMBER """
    print(f"add {a} & {b}")
    return a + b
@mcp.tool()
def subtract(a:int, b:int) -> int:
    """ subtract two number """
    return a - b

@mcp.tool()
def multiply(a:int, b:int) -> int:
    """ multiply two number """
    return a * b

if __name__ == "__main__":
    mcp.run(transport='sse')