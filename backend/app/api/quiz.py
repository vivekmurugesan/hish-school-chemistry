from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncDatabase
from app.database import get_database
from app.models.quiz import QuizRequest, QuizResponse, UserQuizScore, QuizHistory
from app.services.gemini_service import gemini_service
from datetime import datetime

router = APIRouter(prefix='/api/quiz', tags=['quiz'])

@router.post('/generate', response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate a quiz using Gemini AI based on topic and elements."""
    try:
        quiz = await gemini_service.generate_quiz(
            topic=request.topic,
            elements=request.elements,
            difficulty=request.difficulty,
            num_questions=3,
        )
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to generate quiz: {str(e)}')

@router.post('/submit')
async def submit_quiz_score(
    score: UserQuizScore,
    db: AsyncDatabase = Depends(get_database),
):
    """Submit a quiz score for a user."""
    try:
        collection = db['quiz_scores']
        result = await collection.insert_one(score.model_dump())
        return {'message': 'Score saved', 'id': str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/scores/{user_id}')
async def get_user_quiz_scores(
    user_id: str,
    db: AsyncDatabase = Depends(get_database),
):
    """Get all quiz scores for a user."""
    try:
        collection = db['quiz_scores']
        scores = await collection.find({'user_id': user_id}).to_list(None)
        return {
            'user_id': user_id,
            'scores': [
                {
                    'topic': score['topic'],
                    'score': score['score'],
                    'total_questions': score['total_questions'],
                    'percentage': score['percentage'],
                    'completed_at': score['completed_at'],
                }
                for score in scores
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/history/save')
async def save_quiz_history(
    history: QuizHistory,
    db: AsyncDatabase = Depends(get_database),
):
    """Save quiz session history for a user."""
    try:
        collection = db['quiz_history']
        result = await collection.insert_one(history.model_dump())
        return {'message': 'Quiz history saved', 'id': str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/history/{user_id}')
async def get_quiz_history(
    user_id: str,
    db: AsyncDatabase = Depends(get_database),
):
    """Get quiz history for a user."""
    try:
        collection = db['quiz_history']
        history = await collection.find({'user_id': user_id}).sort('created_at', -1).to_list(None)
        return {
            'user_id': user_id,
            'history': [
                {
                    'session_id': h.get('session_id'),
                    'score': h.get('total_score'),
                    'total': h.get('total_questions'),
                    'percentage': h.get('percentage'),
                    'created_at': h.get('created_at'),
                }
                for h in history
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
