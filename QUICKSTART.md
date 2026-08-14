# Quick Start Guide - Chemistry Explorer

Get the Chemistry Interactive Learning Application running in 5 minutes!

## 🚀 Super Quick Start (Docker - Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Gemini API key (get free at https://aistudio.google.com/app/apikey)

### Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/vivekmurugesan/hish-school-chemistry.git
   cd hish-school-chemistry
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Add your Gemini API key** (edit `.env`)
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start everything**
   ```bash
   docker-compose up --build
   ```

5. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

That's it! 🎉

## 📱 What You Can Do

- ✅ Browse the interactive periodic table (118 elements)
- ✅ Click any element to see its properties
- ✅ Generate AI-powered quizzes
- ✅ Save notes and concepts
- ✅ Search for molecules
- ✅ Track quiz scores

## 🛠️ Local Development (Without Docker)

### Frontend Only

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
# But you'll need the backend running for full functionality
```

### Backend Only

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="your_key_here"
export MONGO_URI="mongodb://localhost:27017/chemistry_db"

uvicorn app.main:app --reload
# API at http://localhost:8000
```

### MongoDB (for local backend)

```bash
# Using Docker
docker run -d -p 27017:27017 --name chemistry_db mongo:latest

# Or install MongoDB locally: https://docs.mongodb.com/manual/installation/
```

## 🔧 Common Issues & Fixes

### Docker build fails
```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

### Port 3000 or 8000 already in use
Edit `docker-compose.yml` and change the ports:
```yaml
frontend:
  ports:
    - "3001:3000"  # Changed from 3000
backend:
  ports:
    - "8001:8000"  # Changed from 8000
```

### MongoDB connection error
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Or restart it
docker-compose restart db
```

### Gemini API not working
1. Verify your key: https://aistudio.google.com/app/apikey
2. Check `.env` file has the correct key
3. Restart the backend: `docker-compose restart backend`

## 📚 Useful Commands

```bash
# View logs
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db

# Stop everything
docker-compose down

# Reset everything (clear database)
docker-compose down -v

# Rebuild one service
docker-compose build --no-cache frontend
```

## 🌐 API Examples

### Get all elements
```bash
curl http://localhost:8000/api/elements
```

### Get specific element
```bash
curl http://localhost:8000/api/elements/H
```

### Generate quiz
```bash
curl -X POST http://localhost:8000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Carbon", "difficulty": "medium"}'
```

## 📖 Full Documentation

For detailed setup, deployment, and API documentation, see:
- **SETUP.md** - Complete setup guide with troubleshooting
- **README.md** - Project overview and features
- **http://localhost:8000/docs** - Interactive API documentation (when running)

## 🚀 Next Steps

1. **Explore the app** - Try the periodic table and quizzes
2. **Add more elements** - Database is pre-populated with 3 elements
3. **Customize** - Edit Tailwind colors, quiz difficulty, etc.
4. **Deploy** - See SETUP.md for cloud deployment options

## 💡 Tips

- The periodic table is interactive - hover over elements for effects
- Quiz questions are AI-generated based on your interests
- Click elements to see detailed atomic structure info
- Save important concepts in your notes
- API docs are auto-generated at `/docs`

## 🤝 Need Help?

1. Check logs: `docker-compose logs`
2. Read SETUP.md for detailed troubleshooting
3. Check API docs: http://localhost:8000/docs
4. View source code - well-documented!

---

**Happy learning! 🧪** 

Questions? See the full SETUP.md guide for more details.
