from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncDatabase
from app.database import get_database
from app.models.note import Note, NoteResponse, NoteCreate
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix='/api/notes', tags=['notes'])

@router.get('/{user_id}', response_model=list[NoteResponse])
async def get_user_notes(
    user_id: str,
    db: AsyncDatabase = Depends(get_database),
):
    """Get all notes for a user."""
    try:
        collection = db['notes']
        notes = await collection.find({'user_id': user_id}).to_list(None)

        return [
            NoteResponse(
                id=str(note['_id']),
                **{k: v for k, v in note.items() if k != '_id'},
            )
            for note in notes
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=NoteResponse)
async def create_note(
    note_data: NoteCreate,
    user_id: str,
    db: AsyncDatabase = Depends(get_database),
):
    """Create a new note for a user."""
    try:
        collection = db['notes']

        note = Note(
            user_id=user_id,
            title=note_data.title,
            content=note_data.content,
            element_tags=note_data.element_tags or [],
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )

        result = await collection.insert_one(note.model_dump())
        created_note = await collection.find_one({'_id': result.inserted_id})

        return NoteResponse(
            id=str(created_note['_id']),
            **{k: v for k, v in created_note.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put('/{note_id}', response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteCreate,
    db: AsyncDatabase = Depends(get_database),
):
    """Update an existing note."""
    try:
        collection = db['notes']

        update_data = {
            'title': note_data.title,
            'content': note_data.content,
            'element_tags': note_data.element_tags or [],
            'updated_at': datetime.now(),
        }

        result = await collection.find_one_and_update(
            {'_id': ObjectId(note_id)},
            {'$set': update_data},
            return_document=True,
        )

        if not result:
            raise HTTPException(status_code=404, detail='Note not found')

        return NoteResponse(
            id=str(result['_id']),
            **{k: v for k, v in result.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete('/{note_id}')
async def delete_note(
    note_id: str,
    db: AsyncDatabase = Depends(get_database),
):
    """Delete a note."""
    try:
        collection = db['notes']
        result = await collection.delete_one({'_id': ObjectId(note_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail='Note not found')

        return {'message': 'Note deleted successfully'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
