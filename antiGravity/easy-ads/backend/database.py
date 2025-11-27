from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Update this with your actual Postgres credentials
# format: postgresql+asyncpg://user:password@host/dbname
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost/easyads"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
