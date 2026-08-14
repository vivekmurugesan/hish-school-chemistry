'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    correctAnswer: 1,
    explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.',
  },
  {
    id: 2,
    question: 'How many electrons does an Oxygen atom have?',
    options: ['6', '8', '10', '16'],
    correctAnswer: 1,
    explanation: 'Oxygen has atomic number 8, so it has 8 electrons in a neutral atom.',
  },
  {
    id: 3,
    question: 'What type of bond is found in H₂O?',
    options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'],
    correctAnswer: 1,
    explanation: 'Water has covalent bonds between hydrogen and oxygen atoms.',
  },
  {
    id: 4,
    question: 'Which element has the symbol Au?',
    options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
    correctAnswer: 1,
    explanation: 'Au is the chemical symbol for Gold.',
  },
  {
    id: 5,
    question: 'What is the most abundant element in Earth\'s atmosphere?',
    options: ['Oxygen', 'Hydrogen', 'Nitrogen', 'Argon'],
    correctAnswer: 2,
    explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.',
  },
  {
    id: 6,
    question: 'How many valence electrons does Sodium have?',
    options: ['1', '2', '7', '11'],
    correctAnswer: 0,
    explanation: 'Sodium (Na) has 1 valence electron, making it highly reactive.',
  },
  {
    id: 7,
    question: 'What is the chemical formula for table salt?',
    options: ['KCl', 'NaCl', 'CaCl₂', 'MgCl₂'],
    correctAnswer: 1,
    explanation: 'Table salt is sodium chloride (NaCl).',
  },
  {
    id: 8,
    question: 'Which gas do plants use for photosynthesis?',
    options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswer: 2,
    explanation: 'Plants use carbon dioxide (CO₂) from the air during photosynthesis.',
  },
  {
    id: 9,
    question: 'What is the most common form of carbon in nature?',
    options: ['Diamond', 'Graphite', 'Coal', 'Charcoal'],
    correctAnswer: 1,
    explanation: 'Graphite is the most common and stable form of carbon found in nature.',
  },
  {
    id: 10,
    question: 'Which element is essential for blood clotting?',
    options: ['Iron', 'Calcium', 'Phosphorus', 'Potassium'],
    correctAnswer: 1,
    explanation: 'Calcium is crucial for blood coagulation and bone health.',
  },
  {
    id: 11,
    question: 'What is the atomic mass of Hydrogen?',
    options: ['0.5', '1.008', '2.016', '4.003'],
    correctAnswer: 1,
    explanation: 'Hydrogen has an atomic mass of approximately 1.008 amu.',
  },
  {
    id: 12,
    question: 'Which element is a noble gas?',
    options: ['Chlorine', 'Fluorine', 'Neon', 'Bromine'],
    correctAnswer: 2,
    explanation: 'Neon (Ne) is a noble gas with a full outer electron shell.',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getQuizQuestions(): QuizQuestion[] {
  const shuffled = shuffleArray(QUIZ_POOL);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => getQuizQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (quizComplete) {
      saveQuizHistory();
    }
  }, [quizComplete]);

  const saveQuizHistory = async () => {
    try {
      const userId = localStorage.getItem('userId') || 'default_user';
      const percentage = Math.round((score / quiz.length) * 100);

      const response = await fetch('http://localhost:8000/api/quiz/history/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId,
          total_score: score,
          total_questions: quiz.length,
          percentage: percentage,
          questions_answered: quiz.length,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save quiz history');
      }
    } catch (error) {
      console.error('Error saving quiz history:', error);
    }
  };

  const question = quiz[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    if (optionIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setQuiz(getQuizQuestions());
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 gradient-text">Quiz Complete!</h1>

            <div className="card p-12 mb-8">
              <div className="text-6xl font-bold mb-4">
                {Math.round((score / quiz.length) * 100)}%
              </div>
              <p className="text-2xl mb-4">
                You scored {score} out of {quiz.length}
              </p>
              <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                  style={{ width: `${(score / quiz.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">
                Question {currentQuestion + 1} of {quiz.length}
              </span>
              <span className="text-sm font-semibold">{score} correct</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{
                  width: `${((currentQuestion + 1) / quiz.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="card mb-8 p-8">
            <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !answered && handleAnswer(index)}
                  disabled={answered}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    selectedAnswer === index
                      ? index === question.correctAnswer
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-red-500 bg-red-500/10'
                      : answered && index === question.correctAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    {answered && index === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {answered && selectedAnswer === index && index !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
                <p className="text-sm font-semibold text-blue-300 mb-2">Explanation:</p>
                <p className="text-sm text-slate-300">{question.explanation}</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {answered && (
            <button onClick={handleNext} className="btn-primary w-full">
              {currentQuestion === quiz.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
