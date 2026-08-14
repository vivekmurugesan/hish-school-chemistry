from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Molecule(BaseModel):
    name: str
    formula: str
    description: Optional[str] = None
    atoms: List[str] = []
    polarity: Optional[str] = None
    uses: List[str] = []
    structure: Optional[str] = None
    bond_type: Optional[str] = None
    molecular_weight: Optional[str] = None
    properties: List[str] = []
    equation: Optional[str] = None
    interesting_facts: List[str] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    class Config:
        json_schema_extra = {
            'example': {
                'name': 'Water',
                'formula': 'H₂O',
                'description': 'Essential for all life forms',
                'atoms': ['Hydrogen', 'Oxygen'],
                'polarity': 'Polar',
                'uses': ['Solvent', 'Coolant'],
            }
        }


class MoleculeResponse(BaseModel):
    id: str
    name: str
    formula: str
    description: Optional[str] = None
    atoms: List[str] = []
    polarity: Optional[str] = None
    uses: List[str] = []
    structure: Optional[str] = None
    bond_type: Optional[str] = None
    molecular_weight: Optional[str] = None
    properties: List[str] = []
    equation: Optional[str] = None
    interesting_facts: List[str] = []
