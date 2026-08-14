from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncDatabase
from app.database import get_database
from app.models.element import Element, ElementResponse
from app.services.gemini_service import gemini_service
from bson import ObjectId
from typing import List

router = APIRouter(prefix='/api/elements', tags=['elements'])

# Sample element data for initialization
SAMPLE_ELEMENTS = [
    {
        'atomic_number': 1,
        'symbol': 'H',
        'name': 'Hydrogen',
        'atomic_mass': 1.008,
        'category': 'Nonmetal',
        'electron_configuration': '1s¹',
        'valence_electrons': 1,
        'electronegativity': 2.20,
        'melting_point': '-259.14°C',
        'boiling_point': '-252.87°C',
        'density': '0.08988 g/L',
        'description': 'Hydrogen is the lightest element and most abundant in the universe.',
        'reacts_with': ['O', 'N', 'C', 'S', 'Cl'],
        'interesting_facts': [
            'Hydrogen gas is combustible and produces only water as a byproduct',
            'Used in fuel cells for clean energy',
            'Makes up about 75% of all ordinary matter',
        ],
    },
    {
        'atomic_number': 6,
        'symbol': 'C',
        'name': 'Carbon',
        'atomic_mass': 12.011,
        'category': 'Nonmetal',
        'electron_configuration': '1s² 2s² 2p²',
        'valence_electrons': 4,
        'electronegativity': 2.55,
        'melting_point': '3,550°C',
        'boiling_point': '3,727°C (sublimation)',
        'density': '2.26 g/cm³ (graphite)',
        'description': 'Carbon is the basis for all known life and forms the backbone of organic molecules.',
        'reacts_with': ['H', 'O', 'N', 'S', 'P', 'Cl'],
        'interesting_facts': [
            'Carbon has multiple allotropes: diamond, graphite, and fullerenes',
            'Diamond is the hardest known natural substance',
            'Carbon dating is used to determine the age of ancient objects',
        ],
    },
    {
        'atomic_number': 8,
        'symbol': 'O',
        'name': 'Oxygen',
        'atomic_mass': 15.999,
        'category': 'Nonmetal',
        'electron_configuration': '1s² 2s² 2p⁴',
        'valence_electrons': 6,
        'electronegativity': 3.44,
        'melting_point': '-218.79°C',
        'boiling_point': '-183.34°C',
        'density': '1.429 g/L',
        'description': 'Oxygen is essential for respiration and is highly reactive with most elements.',
        'reacts_with': ['H', 'C', 'N', 'S', 'P'],
        'interesting_facts': [
            'Oxygen is the most abundant element in Earth\'s crust',
            'Ozone (O₃) protects Earth from harmful UV radiation',
            'Makes up about 21% of Earth\'s atmosphere',
        ],
    },
]

@router.get('/', response_model=List[ElementResponse])
async def get_all_elements(db: AsyncDatabase = Depends(get_database)):
    """Get all elements from the periodic table."""
    try:
        collection = db['elements']

        # Initialize with sample data if empty
        count = await collection.count_documents({})
        if count == 0:
            await collection.insert_many(SAMPLE_ELEMENTS)

        elements = await collection.find().to_list(None)
        return [
            ElementResponse(
                id=str(elem['_id']),
                **{k: v for k, v in elem.items() if k != '_id'},
            )
            for elem in elements
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/generate/{symbol}', response_model=ElementResponse)
async def generate_element_details(symbol: str, db: AsyncDatabase = Depends(get_database)):
    """Generate element details using Gemini AI for any periodic table element."""
    try:
        collection = db['elements']
        existing = await collection.find_one({'symbol': symbol.upper()})

        if existing:
            return ElementResponse(
                id=str(existing['_id']),
                **{k: v for k, v in existing.items() if k != '_id'},
            )

        element_data = await gemini_service.generate_element_details(symbol)
        result = await collection.insert_one(element_data)

        created_element = await collection.find_one({'_id': result.inserted_id})
        return ElementResponse(
            id=str(created_element['_id']),
            **{k: v for k, v in created_element.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Failed to generate element details: {str(e)}')

@router.get('/{symbol}', response_model=ElementResponse)
async def get_element(symbol: str, db: AsyncDatabase = Depends(get_database)):
    """Get a specific element by its symbol."""
    try:
        collection = db['elements']
        element = await collection.find_one({'symbol': symbol.upper()})

        if not element:
            raise HTTPException(status_code=404, detail=f'Element {symbol} not found')

        return ElementResponse(
            id=str(element['_id']),
            **{k: v for k, v in element.items() if k != '_id'},
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/', response_model=ElementResponse)
async def create_element(element: Element, db: AsyncDatabase = Depends(get_database)):
    """Create a new element."""
    try:
        collection = db['elements']
        result = await collection.insert_one(element.model_dump())

        created_element = await collection.find_one({'_id': result.inserted_id})
        return ElementResponse(
            id=str(created_element['_id']),
            **{k: v for k, v in created_element.items() if k != '_id'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
