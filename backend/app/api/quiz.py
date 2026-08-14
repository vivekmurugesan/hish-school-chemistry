from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncDatabase
from app.database import get_database
from app.models.quiz import QuizRequest, QuizResponse, UserQuizScore
from app.services.gemini_service import gemini_service

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
