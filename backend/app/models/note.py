from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Note(BaseModel):
    user_id: str
    title: str
    content: str
    element_tags: list[str] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class NoteResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    element_tags: list[str] = []
    created_at: datetime
    updated_at: datetime

class NoteCreate(BaseModel):
    title: str
    content: str
    element_tags: Optional[list[str]] = None
