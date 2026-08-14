# Chemistry Interactive Learning Application

A modern web application for high school chemistry students featuring interactive periodic table exploration, atomic structure visualization, 3D molecule models, gamified quizzes, and AI-powered learning content.

## Features

- 📊 Interactive Periodic Table with clickable elements
- 🔬 Atomic structure visualization with nucleus and electron orbits
- 🧬 3D molecular models with interactive rotation and zoom
- 🎮 Gamified quizzes with Gemini AI-generated questions
- 📝 Personal notes section for saving important details
- 🧠 AI-powered explanations and interesting facts
- 🎨 Modern, engaging UI designed for students

## Quick Start

### Using Docker Compose
```bash
cp .env.example .env
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development
```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

## Project Structure

```
├── frontend/              # Next.js application
├── backend/               # FastAPI application
├── docker-compose.yml
├── .env.example
└── README.md
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Three.js
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **AI**: Google Gemini API
