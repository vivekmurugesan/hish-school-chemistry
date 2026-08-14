# Chemistry Explorer - Setup Guide

This guide covers how to set up and run the Chemistry Interactive Learning Application.

## Prerequisites

### System Requirements
- Docker & Docker Compose (recommended)
- OR Node.js 20+ and Python 3.11+ (for local development)
- 2GB free disk space

### Accounts/Keys Needed
- **Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Quick Start with Docker (Recommended)

### 1. Clone and Configure

```bash
cd /path/to/hish-school-chemistry
cp .env.example .env
```

### 2. Add Your Gemini API Key

Edit `.env` and replace `your_gemini_api_key_here` with your actual key:

```bash
GEMINI_API_KEY=your_actual_key_here
```

### 3. Start All Services

```bash
docker-compose up --build
```

This will:
- Build the frontend (Next.js)
- Build the backend (FastAPI)
- Start MongoDB
- Automatically initialize the database

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MongoDB**: localhost:27017

## Local Development Setup

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="your_key_here"
export MONGO_URI="mongodb://localhost:27017/chemistry_db"

# Run the server
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### MongoDB Setup (Local)

For local MongoDB installation, visit: https://docs.mongodb.com/manual/installation/

Or use Docker:

```bash
docker run -d -p 27017:27017 --name chemistry_db mongo:latest
```

## Environment Variables

### Required

- `GEMINI_API_KEY`: Your Google Gemini API key
- `MONGO_URI`: MongoDB connection string
- `MONGO_DB_NAME`: Database name (default: chemistry_db)

### Optional

- `NEXT_PUBLIC_API_URL`: Frontend API URL (default: http://localhost:8000)
- `API_HOST`: Backend host (default: 0.0.0.0)
- `API_PORT`: Backend port (default: 8000)
- `ENVIRONMENT`: Environment type (default: development)

## Troubleshooting

### Issue: Cannot connect to MongoDB

**Solution**: Make sure MongoDB is running:

```bash
# Check if running with Docker
docker ps | grep mongo

# Or start it
docker-compose up -d db
```

### Issue: Gemini API Key not recognized

**Solution**: 
1. Verify your key is valid at https://aistudio.google.com/app/apikey
2. Check it's properly set in `.env`
3. Restart the container: `docker-compose restart backend`

### Issue: Port already in use

**Solution**: Change ports in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Changed from 3000
  backend:
    ports:
      - "8001:8000"  # Changed from 8000
```

### Issue: Build fails on Windows

**Solution**: Ensure line endings are LF, not CRLF:

```bash
git config --global core.autocrlf input
```

## Useful Commands

### Docker

```bash
# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Format code
black app/

# Check types
mypy app/

# Run tests (when implemented)
pytest
```

## Project Structure

```
.
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   ├── data/             # Static data
│   │   └── types/            # TypeScript types
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── Dockerfile
├── backend/                   # FastAPI application
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── models/           # Pydantic models
│   │   ├── services/         # Business logic
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # DB connection
│   │   └── main.py           # Entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── init-mongo.js         # MongoDB initialization
├── docker-compose.yml        # Service orchestration
├── .env.example              # Environment template
├── README.md                 # Project overview
└── SETUP.md                  # This file
```

## API Endpoints

### Elements

- `GET /api/elements` - Get all elements
- `GET /api/elements/{symbol}` - Get specific element
- `POST /api/elements` - Create element

### Molecules

- `GET /api/molecules/search?query={query}` - Search molecules

### Quiz

- `POST /api/quiz/generate` - Generate quiz questions
- `POST /api/quiz/submit` - Submit quiz score
- `GET /api/quiz/scores/{user_id}` - Get user scores

### Notes

- `GET /api/notes/{user_id}` - Get user notes
- `POST /api/notes` - Create note
- `PUT /api/notes/{note_id}` - Update note
- `DELETE /api/notes/{note_id}` - Delete note

## Performance Tips

1. **Frontend**: Next.js automatically optimizes production builds
2. **Backend**: Use async operations for I/O operations
3. **Database**: MongoDB indexes are created automatically
4. **Caching**: Implement Redis for frequently accessed data (future)

## Security Considerations

1. **API Keys**: Never commit `.env` files with real keys
2. **CORS**: Currently allows all origins (change in production)
3. **Authentication**: Add JWT tokens before deploying (future)
4. **Input Validation**: All endpoints validate input with Pydantic

## Deployment

### Docker Hub Deployment

```bash
# Build images
docker build -t chemistry-app-frontend ./frontend
docker build -t chemistry-app-backend ./backend

# Push to Docker Hub
docker push chemistry-app-frontend
docker push chemistry-app-backend
```

### Cloud Deployment (e.g., AWS, Google Cloud, Heroku)

See individual service documentation for specific deployment guides.

## Support

For issues or questions:
1. Check the README.md
2. Review error logs: `docker-compose logs`
3. Check API docs: http://localhost:8000/docs
4. Create a GitHub issue

## Next Steps

- Implement user authentication (JWT)
- Add more molecules to the database
- Implement 3D visualizations with Three.js
- Add real-time collaboration features
- Deploy to production environment
