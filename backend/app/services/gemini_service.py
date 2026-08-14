import json
import google.generativeai as genai
from app.config import settings
from app.models.quiz import QuizResponse, QuizQuestion
from typing import Optional

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

gemini_service = GeminiService()
