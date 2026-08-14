from motor.motor_asyncio import AsyncClient, AsyncDatabase
from typing import Optional
from app.config import settings

_client: Optional[AsyncClient] = None
_db: Optional[AsyncDatabase] = None

async def connect_to_mongo() -> None:
    global _client, _db
    _client = AsyncClient(settings.mongo_uri)
    _db = _client[settings.mongo_db_name]
    print(f'Connected to MongoDB: {settings.mongo_uri}')

async def close_mongo_connection() -> None:
    global _client
    if _client is not None:
        _client.close()
        print('Closed MongoDB connection')

def get_database() -> AsyncDatabase:
    global _db
    if _db is None:
        raise RuntimeError('Database not connected')
    return _db
