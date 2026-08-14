from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Element(BaseModel):
    atomic_number: int
    symbol: str
    name: str
    atomic_mass: float
    category: str
    electron_configuration: str
    valence_electrons: int
    electronegativity: Optional[float] = None
    melting_point: Optional[str] = None
    boiling_point: Optional[str] = None
    density: Optional[str] = None
    description: Optional[str] = None
    reacts_with: List[str] = []
    interesting_facts: List[str] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        json_schema_extra = {
            'example': {
                'atomic_number': 6,
                'symbol': 'C',
                'name': 'Carbon',
                'atomic_mass': 12.011,
                'category': 'Nonmetal',
                'electron_configuration': '1s² 2s² 2p²',
                'valence_electrons': 4,
            }
        }

class ElementResponse(BaseModel):
    id: str
    atomic_number: int
    symbol: str
    name: str
    atomic_mass: float
    category: str
    electron_configuration: str
    valence_electrons: int
    electronegativity: Optional[float] = None
    melting_point: Optional[str] = None
    boiling_point: Optional[str] = None
    density: Optional[str] = None
    description: Optional[str] = None
    reacts_with: List[str] = []
    interesting_facts: List[str] = []
