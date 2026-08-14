import json
import google.generativeai as genai
from app.config import settings
from app.models.quiz import QuizResponse, QuizQuestion
from typing import Optional, Dict, Any

genai.configure(api_key=settings.gemini_api_key)

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def generate_quiz(
        self,
        topic: str,
        elements: Optional[list[str]] = None,
        difficulty: str = 'medium',
        num_questions: int = 3
    ) -> QuizResponse:
        """Generate a quiz about a chemistry topic using Gemini AI."""

        elements_text = ', '.join(elements) if elements else topic

        prompt = f"""You are an expert chemistry tutor for high school students.
Generate exactly {num_questions} multiple-choice chemistry questions about {topic}.
For elements: {elements_text}

Difficulty: {difficulty}

Return the response in this exact JSON format (no markdown, just raw JSON):
{{
  "topic": "{topic}",
  "questions": [
    {{
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer_index": 0,
      "explanation": "Explanation of the correct answer"
    }}
  ]
}}"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]

            response_text = response_text.strip()
            quiz_data = json.loads(response_text)

            questions = [QuizQuestion(**q) for q in quiz_data['questions']]
            return QuizResponse(topic=topic, questions=questions)
        except Exception as e:
            print(f'Error generating quiz: {e}')
            raise

    async def generate_facts(self, element_symbol: str, element_name: str) -> list[str]:
        """Generate interesting facts about an element."""

        prompt = f"""Generate 3 interesting chemistry facts about {element_name} ({element_symbol}) suitable for high school students.
Keep each fact to 1-2 sentences maximum.
Focus on practical applications, unique properties, or fun trivia.
Return as a JSON array of strings, nothing else."""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Remove markdown if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]

            response_text = response_text.strip()
            facts = json.loads(response_text)
            return facts if isinstance(facts, list) else [facts]
        except Exception as e:
            print(f'Error generating facts: {e}')
            return []

    async def generate_explanation(self, element_symbol: str, element_name: str) -> str:
        """Generate an educational explanation about an element."""

        prompt = f"""Write a concise (2-3 sentences) educational explanation about {element_name} ({element_symbol}) for high school chemistry students.
Focus on its properties, uses, and why it's important in chemistry."""

        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f'Error generating explanation: {e}')
            return 'Unable to generate explanation at this time.'

    async def generate_element_details(self, element_symbol: str) -> Dict[str, Any]:
        """Generate complete element details using Gemini AI."""

        prompt = f"""You are a chemistry expert. Generate complete periodic table data for the element with symbol {element_symbol}.
Return ONLY a valid JSON object with NO additional text or markdown, in this exact format:
{{
  "atomic_number": <number>,
  "symbol": "{element_symbol.upper()}",
  "name": "Element name",
  "atomic_mass": <float>,
  "category": "Nonmetal/Metal/Metalloid/etc",
  "electron_configuration": "1s² 2s² ...",
  "valence_electrons": <number>,
  "electronegativity": <float or null>,
  "melting_point": "°C value or N/A",
  "boiling_point": "°C value or N/A",
  "density": "g/cm³ or g/L value",
  "description": "2-3 sentence description",
  "reacts_with": ["Symbol1", "Symbol2", "Symbol3"],
  "interesting_facts": ["Fact 1", "Fact 2", "Fact 3"]
}}

Make sure:
- All numeric values are actual numbers, not strings
- Lists contain strings for element symbols and facts
- Return ONLY the JSON object, nothing else"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]

            response_text = response_text.strip()
            element_data = json.loads(response_text)
            return element_data
        except Exception as e:
            print(f'Error generating element details: {e}')
            raise

    async def generate_molecule_details(self, molecule_name: str) -> Dict[str, Any]:
        """Generate complete molecule details using Gemini AI."""

        prompt = f"""You are a chemistry expert. Generate complete molecular data for {molecule_name}.
Return ONLY a valid JSON object with NO additional text or markdown, in this exact format:
{{
  "name": "{molecule_name}",
  "formula": "Chemical formula with subscripts like H₂O",
  "description": "1-2 sentence description",
  "atoms": ["Atom1 name", "Atom2 name"],
  "polarity": "Polar/Nonpolar/Ionic",
  "uses": ["Use 1", "Use 2", "Use 3"],
  "structure": "Molecular structure geometry",
  "bond_type": "Covalent/Ionic/Metallic",
  "molecular_weight": "XX.XX g/mol",
  "properties": ["Property 1", "Property 2", "Property 3"],
  "equation": "Chemical reaction equation",
  "interesting_facts": ["Fact 1", "Fact 2", "Fact 3"]
}}

Make sure:
- Properties include physical properties like boiling/melting points
- Equation shows a typical reaction or formation
- Facts are interesting and educational
- Return ONLY the JSON object, nothing else"""

        try:
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()

            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]

            response_text = response_text.strip()
            molecule_data = json.loads(response_text)
            return molecule_data
        except Exception as e:
            print(f'Error generating molecule details: {e}')
            raise

gemini_service = GeminiService()
