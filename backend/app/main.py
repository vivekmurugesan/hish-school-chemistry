from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.config import settings
from app.api import elements, quiz, notes, molecules

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title='Chemistry Explorer API',
    description='API for the Chemistry Interactive Learning Application',
    version='1.0.0',
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Include routers
app.include_router(elements.router)
app.include_router(quiz.router)
app.include_router(notes.router)
app.include_router(molecules.router)

@app.get('/')
async def root():
    """Root endpoint - API is running."""
    return {
        'message': 'Chemistry Explorer API',
        'version': '1.0.0',
        'status': 'running',
        'docs': '/docs',
    }

@app.get('/health')
async def health_check():
    """Health check endpoint."""
    return {'status': 'healthy'}

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(
        'app.main:app',
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.environment == 'development',
    )
