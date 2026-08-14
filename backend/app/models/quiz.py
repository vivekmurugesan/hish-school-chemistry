from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class QuizQuestion(BaseModel):
    id: Optional[int] = None
    question: str
    options: List[str]
    answer_index: int
    explanation: str

class QuizRequest(BaseModel):
    topic: str
    elements: Optional[List[str]] = None
    difficulty: str = 'medium'

class QuizResponse(BaseModel):
    topic: str
    questions: List[QuizQuestion]

class UserQuizScore(BaseModel):
    user_id: str
    topic: str
    score: int
    total_questions: int
    percentage: float
    completed_at: datetime = datetime.now()

class QuizHistory(BaseModel):
    user_id: str
    session_id: str
    total_score: int
    total_questions: int
    percentage: float
    questions_answered: int
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
