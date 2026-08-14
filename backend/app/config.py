import os
from dotenv import load_dotenv
from pydantic import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    gemini_api_key: str = os.getenv('GEMINI_API_KEY', '')
    mongo_uri: str = os.getenv('MONGO_URI', 'mongodb://db:27017/chemistry_db')
    mongo_db_name: str = os.getenv('MONGO_DB_NAME', 'chemistry_db')
    api_host: str = os.getenv('API_HOST', '0.0.0.0')
    api_port: int = int(os.getenv('API_PORT', '8000'))
    environment: str = os.getenv('ENVIRONMENT', 'development')

    class Config:
        env_file = '.env'

settings = Settings()
