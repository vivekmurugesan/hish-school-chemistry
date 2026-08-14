from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncDatabase
from app.database import get_database
from app.models.molecule import Molecule, MoleculeResponse
from app.services.gemini_service import gemini_service
from bson import ObjectId
from typing import List

router = APIRouter(prefix='/api/molecules', tags=['molecules'])


@router.get('/', response_model=List[MoleculeResponse])
async def get_all_molecules(db: AsyncDatabase = Depends(get_database)):
    """Get all molecules from the database."""
    try:
        collection = db['molecules']
        molecules = await collection.find().to_list(None)
        return [
            MoleculeResponse(
                id=str(mol['_id']),
                **{k: v for k, v in mol.items() if k != '_id'},
            )
            for mol in molecules
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/{molecule_name}', response_model=MoleculeResponse)
async def get_molecule(molecule_name: str, db: AsyncDatabase = Depends(get_database)):
    """Get a specific molecule by name."""
    try:
        collection = db['molecules']
        molecule = await collection.find_one({'name': {'$regex': molecule_name, '$options': 'i'}})

        if not molecule:
            raise HTTPException(status_code=404, detail=f'Molecule {molecule_name} not found')

        return MoleculeResponse(
            id=str(molecule['_id']),
            **{k: v for k, v in molecule.items() if k != '_id'},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post('/', response_model=MoleculeResponse)
async def create_molecule(molecule: Molecule, db: AsyncDatabase = Depends(get_database)):
    """Create a new molecule."""
    try:
        collection = db['molecules']
        result = await collection.insert_one(molecule.model_dump())

        created_molecule = await collection.find_one({'_id': result.inserted_id})
        return MoleculeResponse(
            id=str(created_molecule['_id']),
            **{k: v for k, v in created_molecule.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/generate/{molecule_name}', response_model=MoleculeResponse)
async def generate_molecule_details(molecule_name: str, db: AsyncDatabase = Depends(get_database)):
    """Generate molecule details using Gemini AI."""
    try:
        collection = db['molecules']
        existing = await collection.find_one({'name': {'$regex': molecule_name, '$options': 'i'}})

        if existing:
            return MoleculeResponse(
                id=str(existing['_id']),
                **{k: v for k, v in existing.items() if k != '_id'},
            )

        molecule_data = await gemini_service.generate_molecule_details(molecule_name)
        result = await collection.insert_one(molecule_data)

        created_molecule = await collection.find_one({'_id': result.inserted_id})
        return MoleculeResponse(
            id=str(created_molecule['_id']),
            **{k: v for k, v in created_molecule.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to generate molecule details: {str(e)}')


@router.get('/search/{query}', response_model=List[MoleculeResponse])
async def search_molecules(query: str, db: AsyncDatabase = Depends(get_database)):
    """Search molecules by name or formula."""
    try:
        collection = db['molecules']
        search_regex = {'$regex': query, '$options': 'i'}
        molecules = await collection.find(
            {'$or': [{'name': search_regex}, {'formula': search_regex}]}
        ).to_list(None)

        return [
            MoleculeResponse(
                id=str(mol['_id']),
                **{k: v for k, v in mol.items() if k != '_id'},
            )
            for mol in molecules
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
