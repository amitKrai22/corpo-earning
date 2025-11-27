import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.sql import text

# DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost/easyads"
# Try default postgres db first to check credentials
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost/postgres"

async def test_connection():
    try:
        engine = create_async_engine(DATABASE_URL)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Connection Successful! Result: {result.scalar()}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())
