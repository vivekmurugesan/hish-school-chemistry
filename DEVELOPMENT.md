# Development Guide - Chemistry Explorer

Complete guide for developing and contributing to the Chemistry Explorer application.

## 🏗️ Project Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand (ready to implement)
- **HTTP Client**: Axios
- **3D Visualization**: Three.js (ready to implement)

### Backend Stack
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Database**: MongoDB with Motor (async driver)
- **AI**: Google Gemini API
- **API Documentation**: Swagger/OpenAPI (auto-generated)

### Infrastructure
- **Containers**: Docker & Docker Compose
- **Orchestration**: Docker Compose
- **Database**: MongoDB
- **CI/CD**: GitHub Actions (configured)

## 📁 Project Structure

```
hish-school-chemistry/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home page with periodic table
│   │   │   ├── molecules/
│   │   │   │   └── page.tsx        # Molecule explorer
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx        # Quiz section
│   │   │   ├── notes/
│   │   │   │   └── page.tsx        # Notes management
│   │   │   ├── element/
│   │   │   │   └── [symbol]/
│   │   │   │       └── page.tsx    # Element detail page
│   │   │   └── globals.css         # Global styles
│   │   ├── components/
│   │   │   ├── Navigation.tsx      # Top navigation bar
│   │   │   └── PeriodicTable.tsx   # Periodic table component
│   │   ├── data/
│   │   │   └── periodicTable.ts    # Element data
│   │   └── types/                  # TypeScript interfaces (future)
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Configuration and settings
│   │   ├── database.py             # MongoDB connection
│   │   ├── api/
│   │   │   ├── elements.py         # Element endpoints
│   │   │   ├── quiz.py             # Quiz endpoints
│   │   │   ├── notes.py            # Notes endpoints
│   │   │   └── __init__.py
│   │   ├── models/
│   │   │   ├── element.py          # Element models
│   │   │   ├── quiz.py             # Quiz models
│   │   │   ├── note.py             # Note models
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   ├── gemini_service.py   # AI integration
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── init-mongo.js               # MongoDB init script
│   └── .gitignore
│
├── docker-compose.yml              # Service orchestration
├── .env.example                    # Environment template
├── .gitignore
├── README.md                       # Project overview
├── SETUP.md                        # Setup guide
├── QUICKSTART.md                   # Quick start guide
├── DEVELOPMENT.md                  # This file
└── .github/
    └── workflows/
        └── ci.yml                  # GitHub Actions CI/CD
```

## 🚀 Development Workflow

### 1. Setting Up Development Environment

#### With Docker (Recommended)
```bash
docker-compose up --build
```

#### Local Development
```bash
# Terminal 1: Frontend
cd frontend
npm install
npm run dev

# Terminal 2: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 3: Database
docker run -d -p 27017:27017 --name chemistry_db mongo:latest
```

### 2. Making Changes

#### Frontend Changes
- Edit files in `frontend/src/`
- TypeScript strict mode enabled
- Next.js Hot Module Replacement works automatically
- Changes reflect immediately at http://localhost:3000

#### Backend Changes
- Edit files in `backend/app/`
- Uvicorn auto-reload watches for changes
- Changes reflect immediately at http://localhost:8000

#### Database Changes
- Modify MongoDB schemas via API models
- Use migrations for schema changes (future)

### 3. Testing Your Changes

#### Frontend
```bash
cd frontend
npm run lint        # Check TypeScript and linting
npm run build       # Build for production
```

#### Backend
```bash
cd backend
# Run basic checks
python -m pytest    # When tests are implemented
```

## 🎯 Common Development Tasks

### Adding a New Element to Periodic Table

1. **Add to data file** (`frontend/src/data/periodicTable.ts`)
```typescript
{
  atomicNumber: 47,
  symbol: 'Ag',
  name: 'Silver',
  atomicMass: 107.868,
  category: 'Transition Metal',
  row: 5,
  col: 11,
}
```

2. **Backend**: Data will be auto-loaded from MongoDB via API

### Adding a New API Endpoint

1. **Create model** in `backend/app/models/`
```python
from pydantic import BaseModel

class MyModel(BaseModel):
    field1: str
    field2: int
```

2. **Create route** in `backend/app/api/`
```python
from fastapi import APIRouter, Depends

router = APIRouter(prefix='/api/myresource', tags=['myresource'])

@router.get('/')
async def get_myresources():
    return {'message': 'Hello'}
```

3. **Register router** in `backend/app/main.py`
```python
from app.api import myresource
app.include_router(myresource.router)
```

### Styling Changes

1. **Global styles**: Edit `frontend/src/app/globals.css`
2. **Tailwind config**: Edit `frontend/tailwind.config.ts`
3. **Component styles**: Use Tailwind classes directly in JSX

### Using Gemini AI

The `GeminiService` in `backend/app/services/gemini_service.py` handles AI:

```python
from app.services.gemini_service import gemini_service

# Generate quiz
quiz = await gemini_service.generate_quiz(
    topic="Carbon",
    elements=["C"],
    difficulty="medium"
)

# Generate facts
facts = await gemini_service.generate_facts("C", "Carbon")
```

## 🔄 Git Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `claude/*` - Feature branches created by Claude

### Commit Messages
```
<type>: <subject>

<body>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: Add interactive 3D Bohr model visualization

- Use Three.js to render electron orbits
- Add rotation and zoom controls
- Display electron configuration interactively
```

## 📦 Dependencies

### Frontend
```json
{
  "dependencies": {
    "react": "Latest React library",
    "next": "Latest Next.js framework",
    "typescript": "Type checking",
    "tailwindcss": "Utility-first CSS",
    "lucide-react": "Beautiful icons",
    "three": "3D graphics library",
    "@react-three/fiber": "React renderer for Three.js",
    "axios": "HTTP client"
  }
}
```

### Backend
```
fastapi       - Web framework
uvicorn       - ASGI server
pydantic      - Data validation
motor         - Async MongoDB driver
pymongo       - MongoDB client
google-generativeai - Gemini API
python-dotenv - Environment variable loading
```

### To add a dependency:

**Frontend**
```bash
cd frontend
npm install package-name
```

**Backend**
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

## 🧪 Testing (When Implemented)

### Frontend Testing
```bash
cd frontend
npm install --save-dev jest @testing-library/react
npm test
```

### Backend Testing
```bash
cd backend
pip install pytest pytest-asyncio
pytest
```

## 🚨 Code Quality

### Frontend Linting
```bash
cd frontend
npm run lint
```

### Backend Code Style
```bash
cd backend
pip install black flake8
black app/
flake8 app/
```

## 📊 API Documentation

Access auto-generated docs when backend is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Security Considerations

1. **Never commit `.env` files** with real keys
2. **Validate all user input** with Pydantic
3. **Use environment variables** for sensitive data
4. **Add authentication** before production (JWT recommended)
5. **Implement rate limiting** for API endpoints
6. **Use HTTPS** in production

## 🚀 Performance Tips

1. **Frontend**: 
   - Use Next.js Image component for images
   - Implement code splitting with dynamic imports
   - Optimize bundles: `npm run build`

2. **Backend**:
   - Use async/await for I/O operations
   - Index MongoDB collections appropriately
   - Cache frequently accessed data

3. **Database**:
   - Create indexes on frequently queried fields
   - Denormalize when appropriate
   - Monitor query performance

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Gemini API Documentation](https://ai.google.dev)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push to your branch
6. Create a Pull Request

## 📝 Notes

- The app uses TypeScript for type safety
- All API responses include proper error handling
- Database schema is defined in models
- Configuration is centralized in `config.py`
- Environment variables are required for sensitive data

## 🆘 Getting Help

1. Check existing code for patterns
2. Read docstrings and comments
3. Review API documentation at `/docs`
4. Check GitHub issues and PRs
5. Ask in the project discussions

---

**Happy coding! 🧪**
